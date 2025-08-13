function getFbref() {
        const params = new URLSearchParams(window.location.search);
        return params.get('fbref');
    }

    async function trackingLog(activity, cta) {
        const fbref = getFbref();
        const landing_page_id = 2;
        const baseUrl = "https://dev.katib.cloud";

        let locationData = { city: "Unknown", region: "Unknown", country_name: "Unknown" };
        let locationStr = "Unknown";

        // Ambil IP publik di awal
        const ip_address = await fetch('https://api64.ipify.org?format=json')
            .then(response => response.json())
            .then(data => data.ip)
            .catch(() => 'Unknown');

        // Cek apakah kita sudah pernah minta izin lokasi sebelumnya
        const locationAllowed = localStorage.getItem("locationPermission") === "granted";
        const locationDenied = localStorage.getItem("locationPermission") === "denied";

        if (activity === "Landing Page Visit" && !locationAllowed && !locationDenied) {
            // Hanya minta izin lokasi di visit pertama landing page
            try {
                const geoPosition = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                });

                localStorage.setItem("locationPermission", "granted");

                const lat = geoPosition.coords.latitude;
                const lon = geoPosition.coords.longitude;

                const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
                const geoJson = await geoRes.json();

                locationData = {
                    city: geoJson.city || geoJson.locality || "Unknown",
                    region: geoJson.principalSubdivision || "Unknown",
                    country_name: geoJson.countryName || "Unknown"
                };

                locationStr = `${locationData.city}, ${locationData.region}, ${locationData.country_name}`;
            } catch (error) {
                localStorage.setItem("locationPermission", "denied");
                console.warn("Lokasi GPS ditolak atau gagal, pakai IP geolocation");
            }
        }

        // Kalau izin lokasi sudah disimpan atau CTA klik, langsung pakai IP geolocation
        if (locationStr === "Unknown") {
            try {
                const ipGeoRes = await fetch(`https://ipapi.co/${ip_address}/json/`);
                const ipGeoJson = await ipGeoRes.json();
                locationData = {
                    city: ipGeoJson.city || "Unknown",
                    region: ipGeoJson.region || "Unknown",
                    country_name: ipGeoJson.country_name || "Unknown"
                };
                locationStr = `${locationData.city}, ${locationData.region}, ${locationData.country_name}`;
            } catch {
                console.warn("Gagal ambil lokasi dari IP");
            }
        }

        const user_agent = navigator.userAgent;
        const ads_ref = fbref || 'Direct';

        const data = {
            ip_address,
            landing_page_id,
            location: locationStr,
            ads_ref,
            activity,
            cta,
            user_agent
        };

        console.log('Data yang dikirim:', data);

        fetch(`${baseUrl}/add/tracking_page_log`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer DpacnJf3uEQeM7HN'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => console.log('Log berhasil dikirim:', result))
        .catch(error => console.error('Gagal mengirim log:', error));
    }

    window.onload = () => trackingLog('Landing Page Visit', 'First Load Page');