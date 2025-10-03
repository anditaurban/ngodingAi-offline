// Fungsi Facebook Pixel tracking
function trackAddToCart(productId, price) {
fbq("track", "AddToCart", {
    content_ids: [productId],
    content_type: "product",
    value: price,
    currency: "IDR",
});
}

function addPurchase(productId, price) {
  fbq("track", "Purchase", {
    content_ids: [productId],
    content_type: "product",
    value: price,
    currency: "IDR",
});
}

function trackBatchSelection(batchId, batchName, batchPrice) {
  const modalName = document.getElementById("modalBatchName");
  const submitBtn = document.getElementById("modalSubmitBtn");

  // Mapping warna per batch
  const batchColors = {
    7: { text: "text-yellow-600", bg: "bg-yellow-500 hover:bg-yellow-600" },
    8: { text: "text-green-600",  bg: "bg-green-500 hover:bg-green-600" }
  };

  const colors = batchColors[batchId] || { text: "text-gray-600", bg: "bg-gray-500 hover:bg-gray-600" };

  // Set teks nama batch + warna
  modalName.textContent = `Anda memilih ${batchName} | ${batchPrice}`;
  modalName.className = `text-sm font-semibold mb-4 ${colors.text}`;

  // Set warna tombol submit
  submitBtn.className = `px-4 py-2 rounded text-white font-semibold ${colors.bg}`;

  // Set batch_number
  document.getElementById("batch_number").value = batchId;

  // Tampilkan modal
  document.getElementById("batchModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("batchModal").classList.add("hidden");
}

// Autocomplete Region
const regionInput = document.getElementById("region");
const suggestionsBox = document.getElementById("regionSuggestions");
const regionIdInput = document.getElementById("region_id");

regionInput.addEventListener("input", async function () {
  const search = this.value.trim();
  if (search.length < 2) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.add("hidden");
    return;
  }

  try {
    const res = await fetch(
      `https://region.katib.cloud/table/region/4409/1?search=${encodeURIComponent(search)}`,
      {
        method: "GET",
        headers: {
          "Authorization": "Bearer 0f4d99ae56bf938a9dc29d4f4dc499b919e44f4d3774cf2e5c7b9f5395d05fc6",
          "Content-Type": "application/json"
        }
      }
    );

    const data = await res.json();
    const regions = data.tableData || data.data || [];

    if (regions.length === 0) {
      suggestionsBox.innerHTML = "<li class='p-2 text-gray-500'>Tidak ada hasil</li>";
      suggestionsBox.classList.remove("hidden");
      return;
    }

    suggestionsBox.innerHTML = regions.map(region => `
      <li data-id="${region.region_id}" class="p-2 hover:bg-gray-200 cursor-pointer">
        ${region.region_name}
      </li>
    `).join("");
    
    suggestionsBox.classList.remove("hidden");

  } catch (err) {
    console.error("Gagal memuat region:", err);
  }
});

suggestionsBox.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    const selectedId = event.target.getAttribute("data-id");
    const selectedName = event.target.textContent;

    document.getElementById("region").value = selectedName;
    document.getElementById("region_id").value = selectedId;
    suggestionsBox.classList.add("hidden");
  }
});

// document.getElementById("batchForm").addEventListener("submit", async function(e) {
//   e.preventDefault();

//   const formData = Object.fromEntries(new FormData(this).entries());
//   const phone = formData.customer_phone.trim();

//   // Honeypot check
//   const honeypot = formData.website; 
//   if (honeypot) {
//     alert("Data yang anda masukan adalah data palsu."); 
//     return; // hentikan submit
//   }
  
//   // Validasi nomor HP
//   if (!/^\d+$/.test(phone)) {
//     alert("No. WhatsApp hanya boleh berisi angka.");
//     return;
//   }
//   if (!phone.startsWith("08")) {
//     alert("No. WhatsApp harus diawali dengan 08.");
//     return;
//   }
//   if (phone.length < 10 || phone.length > 13) {
//     alert("No. WhatsApp harus antara 10-13 digit.");
//     return;
//   }

//   if (!formData.region_id) {
//     alert("Silakan pilih domisili dari daftar saran.");
//     return;
//   }

//   const batchProductMap = {
//     3: 243868,
//     4: 243869,
//     7: 243866,
//     8: 243867,

//   };

//   const batchNumber = Number(formData.batch_number);
//   const productId = batchProductMap[batchNumber] || 24387;

//   const requestBody = {
//     owner_id: Number(formData.owner_id),
//     region_id: Number(formData.region_id),
//     customer_name: formData.customer_name,
//     customer_phone: phone,
//     customer_email: formData.customer_email,
//     customer_address: formData.customer_address,
//     sales_detail: [
//       { product_id: productId, quantity: 1 }
//     ],
//     notes: "-"
//   };

//   try {
//     const response = await fetch("https://dev.katib.cloud/checkout_duitku/course", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": "Bearer DpacnJf3uEQeM7HN"
//       },
//       body: JSON.stringify(requestBody)
//     });

//     const result = await response.json();

//     if (response.ok) {  
//       trackAddToCart(productId, '178.450');
//       closeModal();
//       window.location.href = result.sales.paymentUrl;
//     } else {
//       alert(`Gagal: ${result.message || 'Terjadi kesalahan'}`);
//     }
//   } catch (error) {
//     console.error("Error saat mengirim data:", error);
//     alert("Terjadi kesalahan saat menghubungi server.");
//   }
// });

document.getElementById("batchForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const submitBtn = document.getElementById("modalSubmitBtn");
  submitBtn.disabled = true;
  // submitBtn.innerHTML = `<div class="loader"></div> Mohon tunggu...`;
 submitBtn.innerHTML = `
  <span class="flex items-center gap-2">
    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
    Pendaftaran diproses...
  </span>
`;

  const formData = Object.fromEntries(new FormData(this).entries());
  const phone = formData.customer_phone.trim();

  // Honeypot check
  const honeypot = formData.website; 
  if (honeypot) {
    alert("Data yang anda masukan adalah data palsu."); 
    resetButton(submitBtn);
    return; 
  }
  
  // Validasi nomor HP
  if (!/^\d+$/.test(phone)) {
    alert("No. WhatsApp hanya boleh berisi angka.");
    resetButton(submitBtn);
    return;
  }
  if (!phone.startsWith("08")) {
    alert("No. WhatsApp harus diawali dengan 08.");
    resetButton(submitBtn);
    return;
  }
  if (phone.length < 10 || phone.length > 13) {
    alert("No. WhatsApp harus antara 10-13 digit.");
    resetButton(submitBtn);
    return;
  }

  if (!formData.region_id) {
    alert("Silakan pilih domisili dari daftar saran.");
    resetButton(submitBtn);
    return;
  }

  const batchProductMap = {
    3: 243868,
    4: 243869,
    7: 243866,
    8: 243867,
  };

  const batchNumber = Number(formData.batch_number);
  const productId = batchProductMap[batchNumber] || 24387;

  const requestBody = {
    owner_id: Number(formData.owner_id),
    region_id: Number(formData.region_id),
    customer_name: formData.customer_name,
    customer_phone: phone,
    customer_email: formData.customer_email,
    customer_address: formData.customer_address,
    sales_detail: [
      { product_id: productId, quantity: 1 }
    ],
    notes: "-"
  };

  try {
    const response = await fetch("https://dev.katib.cloud/checkout_duitku/course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer DpacnJf3uEQeM7HN"
      },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();

    if (response.ok) {  
      trackAddToCart(productId, '178.450');
      closeModal();

      if (result.sales && result.sales.paymentUrl) {
        window.location.href = result.sales.paymentUrl;
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Maaf',
          text: 'No WhatsApp tidak terdaftar.',
          timer: 5000,
          showConfirmButton: false
        }).then(() => {
          window.location.href = "index.html";
        });
        resetButton(submitBtn);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: result.message || "Terjadi kesalahan"
      });
      resetButton(submitBtn);
    }

  } catch (error) {
    console.error("Error saat mengirim data:", error);
    alert("Terjadi kesalahan saat menghubungi server.");
    resetButton(submitBtn);
  }
});

function resetButton(btn) {
  btn.disabled = false;
  btn.innerHTML = "Bayar Disini";
}
