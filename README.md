# DraBornTrips

Antalya’daki tekne turlarını ve ileride eklenecek turistik deneyimleri tek uygulamada keşfetmek, karşılaştırmak ve rezerve etmek için hazırlanan Expo demo uygulaması.

## Demo v0.1 kapsamı

- Antalya geneli demo tekne turu kataloğu
- Liman, saat, süre, rota, yemek, içecek, köpük partisi ve aile uygunluğu bilgileri
- Fiyat, puan, yorum ve anlık boş koltuk gösterimi
- Suluada, aile dostu, köpük partisi, dalış, en yüksek puan ve en ucuz filtreleri
- Tur detay ekranı ve kişi/tarih seçerek demo rezervasyon
- Rezervasyon kodu ve rezervasyonlar ekranı
- Harita üzerinde demo tekne konumları ve canlı konum konsepti
- İşletme panelinden demo tur oluşturma ve müşteri ekranına anında ekleme
- ATV, Jeep Safari, yamaç paraşütü ve transfer kategorileri için genişleme alanı

## Teknoloji

- Expo SDK 57
- React Native 0.86
- React 19.2
- TypeScript
- Veritabanı yok; bütün veriler uygulama belleğinde demo olarak tutulur

## Expo Go ile çalıştırma

```bash
npm install
npx expo start --clear
```

Aynı Wi-Fi ağına bağlı Android telefonda Expo Go’yu açıp terminalde oluşan QR kodu okutun. Ağ problemi yaşanırsa:

```bash
npx expo start --tunnel --clear
```

## Önemli not

Bu sürüm gerçek ödeme, gerçek rezervasyon, kullanıcı hesabı veya kalıcı veri içermez. Uygulama kapandığında işletme tarafından eklenen turlar ve rezervasyonlar sıfırlanır.

## Sonraki üretim adımı

Supabase entegrasyonunda temel tablolar: `profiles`, `businesses`, `boats`, `tours`, `tour_schedules`, `tour_stops`, `inventory`, `bookings`, `payments`, `reviews`, `live_locations`, `promotions`.
