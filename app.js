// // Inisialisasi peta
// var map = L.map('map').setView([-6.9700, 108.0066], 9);
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

// // Konfigurasi MQTT
// var client = mqtt.connect('ws://broker.emqx.io:8083/mqtt', {
//   clientId: 'clientId-' + Math.random(), // Atur ID klien secara unik
// });

// // Fungsi untuk menampilkan koordinat di peta
// function showLocation(latitude, longitude) {
//   map.setView([latitude, longitude], 9);
//   L.marker([latitude, longitude]).addTo(map)
//   .bindPopup('OSO device')
//     .openPopup();
//     map.setView([-7.35523, 108.22847], 9);
//     L.marker([-7.35523, 108.22847]).addTo(map)
//     .bindPopup('OSO device 2')
//       .openPopup();
// }

// // Tangani ketika koneksi berhasil
// client.on('connect', function () {
//   console.log("Connected to MQTT broker");
//   // Langganan topik 'coordinates'
//   client.subscribe('topic/coordinates');
// });

// // Tangani pesan yang diterima
// client.on('message', function (topic, message) {
//   // Periksa topik untuk memastikan Anda menerima pesan dari topik yang benar
//   if (topic === 'topic/coordinates') {
//     try {
//       var text = message.toString();
//       var parts = text.split(',');
//       var latitude = parseFloat(parts[0].split(':')[1].trim());
//       var longitude = parseFloat(parts[1].split(':')[1].trim());
//       showLocation(latitude, longitude);
//     } catch (error) {
//       console.error("Failed to parse message:", error);
//     }
//   }
// });
// Inisialisasi peta
var map = L.map('map').setView([-6.9700, 108.0066], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Objek untuk melacak marker berdasarkan ID koordinat
var markers = {};

// Konfigurasi MQTT
var client = mqtt.connect('ws://broker.emqx.io:8083/mqtt', {
  clientId: 'clientId-' + Math.random(), // Atur ID klien secara unik
});

// Tangani ketika koneksi berhasil
client.on('connect', function () {
  console.log("Connected to MQTT broker");
  // Langganan topik 'coordinates'
  client.subscribe('topic/coordinates');
});

// Tangani pesan yang diterima
client.on('message', function (topic, message) {
  // Periksa topik untuk memastikan Anda menerima pesan dari topik yang benar
  if (topic === 'topic/coordinates') {
    try {
      var data = message.toString().split('&');
      data.forEach(function(item) {
        var parts = item.split(',');
        var id = parts[0].split(':')[1];
        var latitude = parseFloat(parts[1].split(':')[1]);
        var longitude = parseFloat(parts[2].split(':')[1]);

        // Perbarui atau tambahkan marker sesuai dengan ID
        if (markers[id]) {
          markers[id].setLatLng([latitude, longitude]).update();
        } else {
          markers[id] = L.marker([latitude, longitude]).addTo(map)        
          .bindPopup('ID: ' + id)
          .openPopup();
        }

        // Pusatkan peta pada posisi marker terakhir
        map.setView([latitude, longitude], 10);

      });
    } catch (error) {
      console.error("Failed to parse message:", error);
    }
  }
});
