import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  Animated,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { demoTours } from './src/data/demoTours';
import { Booking, TabKey, Tour } from './src/types';

const C = {
  bg: '#07131C', card: '#0D2230', soft: '#123042', line: '#214457',
  text: '#F7FBFD', muted: '#9FB6C3', aqua: '#38D6C5', orange: '#FF9E57',
  yellow: '#FFC857', red: '#FF6B6B', green: '#52D273', sea: '#0A5A73',
};

const filters = [
  ['all', 'Tümü'], ['today', 'Bugün'], ['suluada', 'Suluada'], ['family', 'Aile Dostu'],
  ['foam', 'Köpük'], ['diving', 'Dalış'], ['rated', 'En Yüksek Puan'], ['cheap', 'En Ucuz'],
] as const;
type FilterId = (typeof filters)[number][0];

const money = (value: number) => `${value.toLocaleString('tr-TR')} TL`;
const code = () => `DBT-${Math.floor(100000 + Math.random() * 900000)}`;

function Header({ openInfo }: { openInfo: () => void }) {
  return <View style={s.header}>
    <View><Text style={s.eyebrow}>ANTALYA DENEYİMLERİ</Text><Text style={s.logo}>DraBornTrips</Text></View>
    <TouchableOpacity style={s.demo} onPress={openInfo}><Text style={s.demoDot}>●</Text><Text style={s.demoText}>Demo</Text></TouchableOpacity>
  </View>;
}

function Section({ title, sub }: { title: string; sub: string }) {
  return <View style={s.section}><Text style={s.sectionTitle}>{title}</Text><Text style={s.sectionSub}>{sub}</Text></View>;
}

function Hero({ tours, showToday }: { tours: Tour[]; showToday: () => void }) {
  const seats = tours.reduce((sum, tour) => sum + tour.seatsLeft, 0);
  return <View style={s.hero}>
    <View style={s.heroBubble} />
    <Text style={s.heroKicker}>BUGÜN DENİZ SENİ BEKLİYOR</Text>
    <Text style={s.heroTitle}>Antalya’nın tüm turlarını tek ekranda keşfet.</Text>
    <Text style={s.heroText}>Saat, rota, içerik, fiyat ve boş koltukları karşılaştır. Tek dokunuşla yerini ayır.</Text>
    <TouchableOpacity style={s.mainButton} onPress={showToday}><Text style={s.mainButtonText}>Bugünkü turları gör</Text><Text style={s.arrow}>→</Text></TouchableOpacity>
    <View style={s.stats}>
      <Stat value={`${tours.length}`} label="Aktif tur" /><Stat value={`${seats}`} label="Boş koltuk" /><Stat value="6+" label="Liman" />
    </View>
  </View>;
}

function Stat({ value, label }: { value: string; label: string }) {
  return <View style={s.stat}><Text style={s.statValue}>{value}</Text><Text style={s.statLabel}>{label}</Text></View>;
}

function Categories() {
  const items = [['🚤', 'Tekne', '8 aktif'], ['🤿', 'Dalış', '1 aktif'], ['🏍️', 'ATV', 'Yakında'], ['🚙', 'Jeep', 'Yakında'], ['🪂', 'Yamaç', 'Yakında'], ['🚐', 'Transfer', 'Yakında']];
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.rail}>
    {items.map((item, index) => <View key={item[1]} style={[s.category, index > 1 && s.disabled]}>
      <Text style={s.categoryIcon}>{item[0]}</Text><Text style={s.categoryTitle}>{item[1]}</Text><Text style={s.categorySub}>{item[2]}</Text>
    </View>)}
  </ScrollView>;
}

function Chips({ selected, choose }: { selected: FilterId; choose: (id: FilterId) => void }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.rail}>
    {filters.map(([id, label]) => <TouchableOpacity key={id} onPress={() => choose(id)} style={[s.chip, selected === id && s.chipOn]}>
      <Text style={[s.chipText, selected === id && s.chipTextOn]}>{label}</Text>
    </TouchableOpacity>)}
  </ScrollView>;
}

function Tag({ children }: { children: string }) {
  return <View style={s.tag}><Text style={s.tagText}>{children}</Text></View>;
}

function TourCard({ tour, open }: { tour: Tour; open: () => void }) {
  return <TouchableOpacity style={s.tourCard} onPress={open} activeOpacity={0.92}>
    <ImageBackground source={{ uri: tour.image }} style={s.cover} imageStyle={s.coverImage}>
      <View style={s.coverShade} />
      <View style={s.topLine}>
        <View style={s.rating}><Text style={s.star}>★</Text><Text style={s.ratingText}>{tour.rating.toFixed(1)} ({tour.reviewCount})</Text></View>
        <View style={[s.seats, tour.seatsLeft <= 3 && s.seatsUrgent]}><Text style={s.seatsText}>{tour.seatsLeft <= 3 ? `🔥 Son ${tour.seatsLeft} koltuk` : `${tour.seatsLeft} boş koltuk`}</Text></View>
      </View>
      <View><Text style={s.operator}>{tour.operator}</Text><Text style={s.tourTitle}>{tour.title}</Text></View>
    </ImageBackground>
    <View style={s.tourBody}>
      <View style={s.twoCols}><Info icon="📍" label="Kalkış" value={tour.departurePort} /><Info icon="🕒" label="Saat" value={tour.departureTime} small /></View>
      <Text style={s.route} numberOfLines={1}>🗺️ {tour.route.join(' • ')}</Text>
      <View style={s.tags}>{tour.mealIncluded && <Tag>🍽️ Yemek</Tag>}{tour.drinkIncluded && <Tag>🍹 İçecek</Tag>}{tour.foamParty && <Tag>🎵 Köpük</Tag>}{tour.familyFriendly && <Tag>👨‍👩‍👧 Aile</Tag>}{tour.diving && <Tag>🤿 Dalış</Tag>}</View>
      <View style={s.priceLine}><View><Text style={s.mini}>Kişi başı</Text><Text style={s.price}>{money(tour.price)}</Text></View><View style={s.inspect}><Text style={s.inspectText}>İncele ›</Text></View></View>
    </View>
  </TouchableOpacity>;
}

function Info({ icon, label, value, small }: { icon: string; label: string; value: string; small?: boolean }) {
  return <View style={[s.info, small && { flex: 0.55 }]}><Text style={s.infoIcon}>{icon}</Text><View style={{ flex: 1 }}><Text style={s.mini}>{label}</Text><Text style={s.infoValue} numberOfLines={1}>{value}</Text></View></View>;
}

function Discover({ tours, open, filter, setFilter }: { tours: Tour[]; open: (tour: Tour) => void; filter: FilterId; setFilter: (id: FilterId) => void }) {
  const [query, setQuery] = useState('');
  const shown = useMemo(() => {
    let list = tours.filter(t => [t.title, t.operator, t.departurePort, ...t.route].join(' ').toLocaleLowerCase('tr-TR').includes(query.trim().toLocaleLowerCase('tr-TR')));
    if (filter === 'suluada') list = list.filter(t => t.route.some(r => r.includes('Suluada')));
    if (filter === 'family') list = list.filter(t => t.familyFriendly);
    if (filter === 'foam') list = list.filter(t => t.foamParty);
    if (filter === 'diving') list = list.filter(t => t.diving);
    if (filter === 'rated') list = [...list].sort((a, b) => b.rating - a.rating);
    if (filter === 'cheap') list = [...list].sort((a, b) => a.price - b.price);
    return list;
  }, [tours, query, filter]);

  return <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <Hero tours={tours} showToday={() => setFilter('today')} />
    <View style={s.search}><Text style={s.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder="Tur, liman veya koy ara..." placeholderTextColor={C.muted} style={s.searchInput} />{query ? <TouchableOpacity onPress={() => setQuery('')}><Text style={s.clear}>×</Text></TouchableOpacity> : null}</View>
    <Section title="Ne yapmak istersin?" sub="DraBornTrips deneyimleri" /><Categories />
    <Section title="Hızlı keşfet" sub="İhtiyacına göre filtrele" /><Chips selected={filter} choose={setFilter} />
    <Section title={query || filter !== 'all' ? 'Arama sonuçları' : 'Öne çıkan turlar'} sub={`${shown.length} seçenek bulundu`} />
    {shown.length ? shown.map(t => <TourCard key={t.id} tour={t} open={() => open(t)} />) : <Empty />}
  </ScrollView>;
}

function Empty() {
  return <View style={s.empty}><Text style={s.emptyIcon}>🌊</Text><Text style={s.emptyTitle}>Tur bulunamadı</Text><Text style={s.emptyText}>Başka bir liman veya rota aramayı dene.</Text></View>;
}

function MapScreen({ tours, open }: { tours: Tour[]; open: (tour: Tour) => void }) {
  const [activeId, setActiveId] = useState(tours[0]?.id ?? '');
  const pulse = useRef(new Animated.Value(0)).current;
  const active = tours.find(t => t.id === activeId) ?? tours[0];
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }), Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true })]));
    loop.start(); return () => loop.stop();
  }, [pulse]);
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });
  return <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.mapHead}><View><Text style={s.sectionTitle}>Canlı tur haritası</Text><Text style={s.sectionSub}>Demo tekne konumları • Antalya kıyıları</Text></View><View style={s.live}><Text style={s.liveText}>● CANLI</Text></View></View>
    <View style={s.map}>
      <View style={[s.mapLine, { top: '25%', transform: [{ rotate: '-8deg' }] }]} /><View style={[s.mapLine, { top: '68%', transform: [{ rotate: '8deg' }] }]} />
      <Text style={[s.mapLabel, { left: '47%', top: '50%' }]}>ANTALYA</Text><Text style={[s.mapLabel, { left: '12%', top: '75%' }]}>KAŞ</Text><Text style={[s.mapLabel, { left: '80%', top: '64%' }]}>ALANYA</Text><Text style={s.med}>AKDENİZ</Text>
      {tours.map(t => {
        const chosen = t.id === active?.id;
        return <TouchableOpacity key={t.id} onPress={() => setActiveId(t.id)} style={[s.markerWrap, { left: `${t.mapX}%`, top: `${t.mapY}%` }]}>
          {chosen && <Animated.View style={[s.pulse, { transform: [{ scale }], opacity }]} />}
          <View style={[s.marker, chosen && s.markerOn]}><Text>{t.diving ? '🤿' : '🚤'}</Text></View>{chosen && <Text style={s.markerTime}>{t.departureTime}</Text>}
        </TouchableOpacity>;
      })}
    </View>
    {active && <View style={s.mapCard}><View style={s.topLine}><View style={{ flex: 1 }}><Text style={s.eyebrow}>SEÇİLİ TUR</Text><Text style={s.mapTitle}>{active.title}</Text></View><Text style={s.mapPrice}>{money(active.price)}</Text></View><Text style={s.coords}>📍 {active.latitudeLabel}  •  {active.longitudeLabel}</Text><View style={s.stats}><Stat value={active.departureTime} label="Kalkış" /><Stat value={active.duration} label="Süre" /><Stat value={`${active.seatsLeft}`} label="Koltuk" /></View><TouchableOpacity style={s.mainButton} onPress={() => open(active)}><Text style={s.mainButtonText}>Tur detayını aç</Text></TouchableOpacity></View>}
    <View style={s.notice}><Text>ℹ️</Text><Text style={s.noticeText}>Gerçek sürümde işletmenin GPS paylaşımıyla tekne konumu, gecikme ve limana dönüş bilgisi canlı gösterilecek.</Text></View>
  </ScrollView>;
}

function Bookings({ bookings }: { bookings: Booking[] }) {
  return <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <Section title="Rezervasyonlarım" sub="Tüm tur planların tek yerde" />
    {!bookings.length ? <View style={s.empty}><Text style={s.emptyIcon}>🎟️</Text><Text style={s.emptyTitle}>Henüz rezervasyon yok</Text><Text style={s.emptyText}>Bir tur seçerek birkaç saniyede demo rezervasyon oluşturabilirsin.</Text></View> : bookings.map(b => <View key={b.id} style={s.bookingCard}>
      <View style={s.topLine}><View style={s.ok}><Text style={s.okText}>✓ {b.status}</Text></View><Text style={s.bookingCode}>{b.code}</Text></View>
      <Text style={s.bookingTitle}>{b.tourTitle}</Text><Text style={s.operator}>{b.operator}</Text>
      <View style={s.bookingGrid}><Box label="Tarih" value={b.date} /><Box label="Saat" value={b.departureTime} /><Box label="Kalkış" value={b.departurePort} /><Box label="Misafir" value={`${b.guests} kişi`} /></View>
      <View style={s.priceLine}><Text style={s.mini}>Toplam ödeme</Text><Text style={s.price}>{money(b.total)}</Text></View>
    </View>)}
  </ScrollView>;
}

function Box({ label, value }: { label: string; value: string }) { return <View style={s.box}><Text style={s.mini}>{label}</Text><Text style={s.boxValue} numberOfLines={1}>{value}</Text></View>; }

function Business({ addTour, count }: { addTour: (tour: Tour) => void; count: number }) {
  const [form, setForm] = useState({ title: '', operator: '', port: '', time: '09:30', route: '', price: '', seats: '' });
  const [message, setMessage] = useState('');
  const set = (key: keyof typeof form, value: string) => { setForm(old => ({ ...old, [key]: value })); setMessage(''); };
  const publish = () => {
    const price = Number(form.price.replace(/\D/g, '')), seats = Number(form.seats.replace(/\D/g, ''));
    if (!form.title || !form.operator || !form.port || !price || !seats) return setMessage('Zorunlu alanları doldur.');
    addTour({ id: `new-${Date.now()}`, category: 'boat', title: form.title, operator: form.operator, departurePort: form.port, departureTime: form.time || '09:30', duration: '6 saat', route: form.route.split(',').map(x => x.trim()).filter(Boolean), mealIncluded: true, drinkIncluded: false, foamParty: false, familyFriendly: true, diving: false, rating: 5, reviewCount: 0, price, seatsLeft: seats, capacity: seats, image: 'https://images.unsplash.com/photo-1528150177508-7cc0c36cda5c?auto=format&fit=crop&w=1200&q=85', description: 'İşletme panelinden eklenen demo tur.', latitudeLabel: '36.8841° N', longitudeLabel: '30.7039° E', mapX: 55, mapY: 52 });
    setForm({ title: '', operator: '', port: '', time: '09:30', route: '', price: '', seats: '' }); setMessage('Tur yayınlandı ve Keşfet ekranına eklendi.');
  };
  return <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <View style={s.businessHero}><Text style={s.businessIcon}>⚓</Text><Text style={s.businessTitle}>Tekne İşletmesi Paneli</Text><Text style={s.heroText}>Tur oluştur, saat ve fiyat belirle, koltuk kapasitesini yönet. Demo kayıtları anında müşteri ekranına düşer.</Text><View style={s.stats}><Stat value={`${count}`} label="Yayınlanan" /><Stat value="%8" label="Komisyon" /><Stat value="0 TL" label="Demo kazanç" /></View></View>
    <Section title="Yeni tur oluştur" sub="Zorunlu alanları doldur" />
    <View style={s.formCard}><Input label="Tur adı" value={form.title} change={v => set('title', v)} placeholder="Suluada Günlük Tekne Turu" /><Input label="İşletme adı" value={form.operator} change={v => set('operator', v)} placeholder="Mavi Rota Turizm" /><Input label="Kalkış limanı" value={form.port} change={v => set('port', v)} placeholder="Adrasan Limanı" /><View style={s.twoCols}><Input label="Kalkış" value={form.time} change={v => set('time', v)} placeholder="09:30" half /><Input label="Fiyat" value={form.price} change={v => set('price', v)} placeholder="1450" half numeric /></View><Input label="Rota / koylar" value={form.route} change={v => set('route', v)} placeholder="Suluada, Aşk Mağarası" /><Input label="Koltuk sayısı" value={form.seats} change={v => set('seats', v)} placeholder="40" numeric />{message ? <Text style={[s.message, message.startsWith('Tur yayınlandı') && { color: C.green }]}>{message}</Text> : null}<TouchableOpacity style={s.mainButton} onPress={publish}><Text style={s.mainButtonText}>Turu yayınla</Text></TouchableOpacity></View>
    <View style={s.notice}><Text>🚀</Text><Text style={s.noticeText}>Supabase sonrasında fotoğraf yükleme, gerçek zamanlı koltuk, ödeme, iptal/iade, yorum ve canlı GPS yönetimi eklenecek.</Text></View>
  </ScrollView>;
}

function Input({ label, value, change, placeholder, half, numeric }: { label: string; value: string; change: (v: string) => void; placeholder: string; half?: boolean; numeric?: boolean }) {
  return <View style={[s.inputGroup, half && { flex: 1 }]}><Text style={s.inputLabel}>{label}</Text><TextInput value={value} onChangeText={change} placeholder={placeholder} placeholderTextColor={C.muted} keyboardType={numeric ? 'numeric' : 'default'} style={s.input} /></View>;
}

function Detail({ tour, close, book }: { tour: Tour | null; close: () => void; book: (tour: Tour, guests: number, date: string) => void }) {
  const [guests, setGuests] = useState(1), [date, setDate] = useState('Bugün');
  useEffect(() => { setGuests(1); setDate('Bugün'); }, [tour?.id]);
  if (!tour) return null;
  return <Modal visible animationType="slide" onRequestClose={close}><SafeAreaView style={s.modal}><StatusBar style="light" /><ScrollView contentContainerStyle={s.modalContent} showsVerticalScrollIndicator={false}>
    <ImageBackground source={{ uri: tour.image }} style={s.detailCover} imageStyle={s.detailImage}><View style={s.coverShade} /><TouchableOpacity style={s.close} onPress={close}><Text style={s.closeText}>×</Text></TouchableOpacity><View><Text style={s.operator}>{tour.operator}</Text><Text style={s.detailTitle}>{tour.title}</Text><Text style={s.detailRating}>★ {tour.rating.toFixed(1)} ({tour.reviewCount} yorum)  •  {tour.seatsLeft} koltuk</Text></View></ImageBackground>
    <View style={s.bookingGrid}><Box label="📍 Kalkış" value={tour.departurePort} /><Box label="🕒 Saat" value={tour.departureTime} /><Box label="⏱️ Süre" value={tour.duration} /><Box label="💰 Kişi başı" value={money(tour.price)} /></View>
    <Section title="Tur hakkında" sub={tour.description} />
    <View style={s.formCard}><Text style={s.inputLabel}>🗺️ Gidilecek koylar</Text>{tour.route.map((r, i) => <View key={r} style={s.routeItem}><Text style={s.routeIndex}>{i + 1}</Text><Text style={s.routeName}>{r}</Text></View>)}</View>
    <Section title="Tura dahil olanlar" sub="İşletmenin bildirdiği içerik" /><View style={s.tags}><Tag>{tour.mealIncluded ? '✓ Öğle yemeği' : '× Yemek yok'}</Tag><Tag>{tour.drinkIncluded ? '✓ İçecek' : '× İçecek yok'}</Tag><Tag>{tour.foamParty ? '✓ Köpük partisi' : '× Köpük yok'}</Tag><Tag>{tour.familyFriendly ? '✓ Aileye uygun' : '× Yetişkin odaklı'}</Tag></View>
    <View style={s.reservePanel}><Text style={s.bookingTitle}>Rezervasyonunu oluştur</Text><Text style={s.sectionSub}>İşlem demo olarak uygulama belleğinde tutulur.</Text><Text style={s.inputLabel}>Tarih seç</Text><View style={s.dateRow}>{['Bugün', 'Yarın', '8 Ağustos'].map(d => <TouchableOpacity key={d} onPress={() => setDate(d)} style={[s.date, date === d && s.dateOn]}><Text style={[s.dateText, date === d && s.dateTextOn]}>{d}</Text></TouchableOpacity>)}</View><View style={s.topLine}><View><Text style={s.inputLabel}>Misafir sayısı</Text><Text style={s.mini}>En fazla {Math.min(8, tour.seatsLeft)} kişi</Text></View><View style={s.stepper}><TouchableOpacity onPress={() => setGuests(Math.max(1, guests - 1))}><Text style={s.step}>−</Text></TouchableOpacity><Text style={s.stepValue}>{guests}</Text><TouchableOpacity onPress={() => setGuests(Math.min(Math.min(8, tour.seatsLeft), guests + 1))}><Text style={s.step}>+</Text></TouchableOpacity></View></View><View style={s.priceLine}><Text style={s.sectionTitle}>Toplam</Text><Text style={s.price}>{money(tour.price * guests)}</Text></View><TouchableOpacity style={[s.mainButton, { backgroundColor: C.orange }]} onPress={() => book(tour, guests, date)}><Text style={s.mainButtonText}>Tek dokunuşla rezervasyon yap</Text></TouchableOpacity></View>
  </ScrollView></SafeAreaView></Modal>;
}

function InfoModal({ visible, close }: { visible: boolean; close: () => void }) {
  return <Modal transparent visible={visible} animationType="fade" onRequestClose={close}><View style={s.backdrop}><View style={s.popup}><Text style={s.popupIcon}>D</Text><Text style={s.popupTitle}>DraBornTrips Demo v0.1</Text><Text style={s.popupText}>Bu sürüm veritabanı ve gerçek ödeme kullanmaz. Turlar, koltuklar, canlı konumlar ve rezervasyonlar demo verilerle çalışır.</Text><TouchableOpacity style={s.mainButton} onPress={close}><Text style={s.mainButtonText}>Anladım</Text></TouchableOpacity></View></View></Modal>;
}

function Success({ booking, close }: { booking: Booking | null; close: () => void }) {
  return <Modal transparent visible={!!booking} animationType="fade"><View style={s.backdrop}><View style={[s.popup, { alignItems: 'center' }]}><Text style={s.success}>✓</Text><Text style={s.popupTitle}>Rezervasyon onaylandı</Text><Text style={s.popupText}>{booking?.tourTitle}</Text><View style={s.codeBox}><Text style={s.mini}>Rezervasyon kodun</Text><Text style={s.code}>{booking?.code}</Text></View><TouchableOpacity style={[s.mainButton, { width: '100%' }]} onPress={close}><Text style={s.mainButtonText}>Rezervasyonlarıma git</Text></TouchableOpacity></View></View></Modal>;
}

function Tabs({ active, set }: { active: TabKey; set: (tab: TabKey) => void }) {
  const tabs: [TabKey, string, string][] = [['discover', '⌂', 'Keşfet'], ['map', '⌖', 'Harita'], ['bookings', '🎟', 'Rezervasyon'], ['business', '⚓', 'İşletme']];
  return <View style={s.tabs}>{tabs.map(([id, icon, label]) => <TouchableOpacity key={id} style={s.tab} onPress={() => set(id)}><Text style={[s.tabIcon, active === id && s.tabOn]}>{icon}</Text><Text style={[s.tabText, active === id && s.tabOn]}>{label}</Text></TouchableOpacity>)}</View>;
}

export default function App() {
  const [tab, setTab] = useState<TabKey>('discover');
  const [selected, setSelected] = useState<Tour | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [created, setCreated] = useState<Tour[]>([]);
  const [seats, setSeats] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<FilterId>('all');
  const [info, setInfo] = useState(false);
  const [success, setSuccess] = useState<Booking | null>(null);
  const tours = useMemo(() => [...demoTours, ...created].map(t => ({ ...t, seatsLeft: seats[t.id] ?? t.seatsLeft })), [created, seats]);
  const open = (tour: Tour) => setSelected(tours.find(t => t.id === tour.id) ?? tour);
  const book = (tour: Tour, guests: number, date: string) => {
    const booking: Booking = { id: `${Date.now()}`, tourId: tour.id, tourTitle: tour.title, operator: tour.operator, date, departureTime: tour.departureTime, departurePort: tour.departurePort, guests, total: tour.price * guests, status: 'Onaylandı', code: code() };
    setBookings(old => [booking, ...old]); setSeats(old => ({ ...old, [tour.id]: Math.max(0, tour.seatsLeft - guests) })); setSelected(null); setSuccess(booking);
  };
  const closeSuccess = () => { setSuccess(null); setTab('bookings'); };
  return <SafeAreaView style={s.safe}><StatusBar style="light" /><View style={{ flex: 1 }}><Header openInfo={() => setInfo(true)} /><View style={{ flex: 1 }}>{tab === 'discover' && <Discover tours={tours} open={open} filter={filter} setFilter={setFilter} />}{tab === 'map' && <MapScreen tours={tours} open={open} />}{tab === 'bookings' && <Bookings bookings={bookings} />}{tab === 'business' && <Business count={created.length} addTour={tour => setCreated(old => [tour, ...old])} />}</View><Tabs active={tab} set={setTab} /></View><Detail tour={selected} close={() => setSelected(null)} book={book} /><InfoModal visible={info} close={() => setInfo(false)} /><Success booking={success} close={closeSuccess} /></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { height: 72, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: C.line },
  eyebrow: { color: C.aqua, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 }, logo: { color: C.text, fontSize: 24, fontWeight: '900' },
  demo: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 8 }, demoDot: { color: C.green, marginRight: 7 }, demoText: { color: C.text, fontWeight: '800', fontSize: 12 },
  content: { padding: 16, paddingBottom: 30 },
  hero: { backgroundColor: C.card, borderRadius: 28, padding: 22, borderWidth: 1, borderColor: C.line, overflow: 'hidden' }, heroBubble: { position: 'absolute', width: 190, height: 190, borderRadius: 95, right: -55, top: -80, backgroundColor: '#0E756F', opacity: 0.28 },
  heroKicker: { color: C.orange, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 }, heroTitle: { color: C.text, fontSize: 31, lineHeight: 36, fontWeight: '900', marginTop: 10, letterSpacing: -1 }, heroText: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 10 },
  mainButton: { marginTop: 16, backgroundColor: C.aqua, borderRadius: 16, paddingVertical: 15, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, mainButtonText: { color: '#05221F', fontWeight: '900', fontSize: 14 }, arrow: { color: '#05221F', fontSize: 21 },
  stats: { flexDirection: 'row', gap: 8, marginTop: 16 }, stat: { flex: 1, backgroundColor: C.soft, borderRadius: 13, padding: 10 }, statValue: { color: C.text, fontSize: 17, fontWeight: '900' }, statLabel: { color: C.muted, fontSize: 9, marginTop: 3 },
  search: { height: 56, marginTop: 16, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 18, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 }, searchIcon: { color: C.aqua, fontSize: 25, marginRight: 9 }, searchInput: { flex: 1, color: C.text, fontSize: 14 }, clear: { color: C.text, fontSize: 22 },
  section: { marginTop: 24, marginBottom: 11 }, sectionTitle: { color: C.text, fontSize: 20, fontWeight: '900' }, sectionSub: { color: C.muted, fontSize: 11, marginTop: 3, lineHeight: 17 },
  rail: { paddingRight: 15, gap: 9 }, category: { width: 102, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 13 }, disabled: { opacity: 0.5 }, categoryIcon: { fontSize: 25 }, categoryTitle: { color: C.text, fontSize: 14, fontWeight: '900', marginTop: 8 }, categorySub: { color: C.aqua, fontSize: 9, marginTop: 3 },
  chip: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 99, paddingHorizontal: 14, paddingVertical: 10 }, chipOn: { backgroundColor: C.aqua, borderColor: C.aqua }, chipText: { color: C.muted, fontSize: 11, fontWeight: '800' }, chipTextOn: { color: '#05221F' },
  tourCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 24, overflow: 'hidden', marginBottom: 14 }, cover: { height: 220, padding: 14, justifyContent: 'space-between' }, coverImage: { borderTopLeftRadius: 23, borderTopRightRadius: 23 }, coverShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(3,12,18,0.30)' }, topLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  rating: { flexDirection: 'row', backgroundColor: 'rgba(5,18,25,0.86)', borderRadius: 99, paddingHorizontal: 9, paddingVertical: 7 }, star: { color: C.yellow, marginRight: 4 }, ratingText: { color: C.text, fontSize: 10, fontWeight: '800' }, seats: { backgroundColor: 'rgba(5,18,25,0.86)', borderRadius: 99, paddingHorizontal: 9, paddingVertical: 7 }, seatsUrgent: { backgroundColor: C.red }, seatsText: { color: C.text, fontSize: 10, fontWeight: '900' },
  operator: { color: C.aqua, fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 }, tourTitle: { color: '#fff', fontSize: 24, lineHeight: 28, fontWeight: '900', marginTop: 5 }, tourBody: { padding: 15 }, twoCols: { flexDirection: 'row', gap: 10 }, info: { flex: 1, flexDirection: 'row', alignItems: 'center' }, infoIcon: { fontSize: 17, marginRight: 7 }, mini: { color: C.muted, fontSize: 9 }, infoValue: { color: C.text, fontSize: 11, fontWeight: '800', marginTop: 2 }, route: { color: C.muted, fontSize: 11, marginTop: 13 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 11 }, tag: { backgroundColor: C.soft, borderRadius: 99, paddingHorizontal: 9, paddingVertical: 6 }, tagText: { color: C.text, fontSize: 9, fontWeight: '700' }, priceLine: { marginTop: 14, paddingTop: 13, borderTopWidth: 1, borderTopColor: C.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, price: { color: C.text, fontSize: 21, fontWeight: '900', marginTop: 2 }, inspect: { backgroundColor: C.aqua, borderRadius: 13, paddingHorizontal: 13, paddingVertical: 10 }, inspectText: { color: '#05221F', fontWeight: '900', fontSize: 11 },
  empty: { minHeight: 250, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 24, alignItems: 'center', justifyContent: 'center', padding: 25 }, emptyIcon: { fontSize: 42 }, emptyTitle: { color: C.text, fontSize: 19, fontWeight: '900', marginTop: 10 }, emptyText: { color: C.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 6 },
  mapHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }, live: { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: 'rgba(82,210,115,0.12)' }, liveText: { color: C.green, fontSize: 9, fontWeight: '900' }, map: { height: 440, borderRadius: 28, backgroundColor: C.sea, overflow: 'hidden', borderWidth: 1, borderColor: '#277D94' }, mapLine: { position: 'absolute', width: '120%', height: 18, left: '-10%', backgroundColor: '#0F6C79', borderRadius: 20 }, mapLabel: { position: 'absolute', color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: '900', letterSpacing: 1 }, med: { position: 'absolute', left: '34%', top: '79%', color: 'rgba(255,255,255,0.20)', fontSize: 20, fontWeight: '900', letterSpacing: 4 },
  markerWrap: { position: 'absolute', marginLeft: -20, marginTop: -20, alignItems: 'center' }, pulse: { position: 'absolute', width: 42, height: 42, borderRadius: 21, backgroundColor: C.aqua }, marker: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.card, borderWidth: 2, borderColor: C.text, alignItems: 'center', justifyContent: 'center' }, markerOn: { backgroundColor: C.aqua, borderColor: C.aqua }, markerTime: { color: C.text, backgroundColor: C.card, fontSize: 8, fontWeight: '900', borderRadius: 99, paddingHorizontal: 6, paddingVertical: 3, marginTop: 4, overflow: 'hidden' }, mapCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 23, padding: 16, marginTop: 13 }, mapTitle: { color: C.text, fontSize: 18, fontWeight: '900', marginTop: 4 }, mapPrice: { color: C.orange, fontSize: 15, fontWeight: '900' }, coords: { color: C.muted, fontSize: 10, marginTop: 9 }, notice: { flexDirection: 'row', gap: 9, backgroundColor: 'rgba(255,200,87,0.08)', borderWidth: 1, borderColor: 'rgba(255,200,87,0.22)', borderRadius: 17, padding: 13, marginTop: 13 }, noticeText: { flex: 1, color: '#D7C99F', fontSize: 11, lineHeight: 17 },
  bookingCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 23, padding: 16, marginBottom: 13 }, ok: { backgroundColor: 'rgba(82,210,115,0.12)', borderRadius: 99, paddingHorizontal: 9, paddingVertical: 6 }, okText: { color: C.green, fontSize: 9, fontWeight: '900' }, bookingCode: { color: C.muted, fontSize: 10 }, bookingTitle: { color: C.text, fontSize: 20, fontWeight: '900', marginTop: 13 }, bookingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 13 }, box: { width: '48.7%', backgroundColor: C.soft, borderRadius: 13, padding: 10 }, boxValue: { color: C.text, fontSize: 11, fontWeight: '800', marginTop: 4 },
  businessHero: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 26, padding: 20 }, businessIcon: { width: 52, height: 52, borderRadius: 17, backgroundColor: C.aqua, textAlign: 'center', lineHeight: 52, fontSize: 27, overflow: 'hidden' }, businessTitle: { color: C.text, fontSize: 24, fontWeight: '900', marginTop: 14 }, formCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 23, padding: 15 }, inputGroup: { marginBottom: 12 }, inputLabel: { color: C.text, fontSize: 11, fontWeight: '800', marginBottom: 7 }, input: { height: 49, backgroundColor: C.soft, borderWidth: 1, borderColor: C.line, borderRadius: 13, color: C.text, paddingHorizontal: 12, fontSize: 12 }, message: { color: C.red, fontSize: 11 },
  modal: { flex: 1, backgroundColor: C.bg }, modalContent: { padding: 14, paddingBottom: 40 }, detailCover: { height: 330, padding: 14, justifyContent: 'space-between' }, detailImage: { borderRadius: 27 }, close: { alignSelf: 'flex-end', width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(5,18,25,0.86)', alignItems: 'center', justifyContent: 'center' }, closeText: { color: C.text, fontSize: 28 }, detailTitle: { color: '#fff', fontSize: 29, lineHeight: 34, fontWeight: '900', marginTop: 5 }, detailRating: { color: C.yellow, fontSize: 10, fontWeight: '800', marginTop: 8 }, routeItem: { flexDirection: 'row', alignItems: 'center', marginTop: 10 }, routeIndex: { width: 27, height: 27, borderRadius: 14, backgroundColor: C.aqua, color: '#05221F', textAlign: 'center', lineHeight: 27, fontWeight: '900', marginRight: 9, overflow: 'hidden' }, routeName: { color: C.text, fontSize: 12, fontWeight: '700' }, reservePanel: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 23, padding: 16, marginTop: 22 }, dateRow: { flexDirection: 'row', gap: 7, marginTop: 8, marginBottom: 16 }, date: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingVertical: 10, alignItems: 'center' }, dateOn: { backgroundColor: C.aqua, borderColor: C.aqua }, dateText: { color: C.muted, fontSize: 9, fontWeight: '800' }, dateTextOn: { color: '#05221F' }, stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.soft, borderRadius: 13 }, step: { color: C.aqua, fontSize: 22, paddingHorizontal: 14, paddingVertical: 8 }, stepValue: { color: C.text, fontWeight: '900', minWidth: 26, textAlign: 'center' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', alignItems: 'center', justifyContent: 'center', padding: 20 }, popup: { width: '100%', backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 27, padding: 22 }, popupIcon: { width: 52, height: 52, borderRadius: 17, backgroundColor: C.aqua, color: '#05221F', fontSize: 25, fontWeight: '900', textAlign: 'center', lineHeight: 52, overflow: 'hidden' }, popupTitle: { color: C.text, fontSize: 23, fontWeight: '900', marginTop: 14, textAlign: 'center' }, popupText: { color: C.muted, fontSize: 12, lineHeight: 19, marginTop: 8, textAlign: 'center' }, success: { width: 65, height: 65, borderRadius: 33, backgroundColor: C.green, color: '#05240E', fontSize: 32, fontWeight: '900', textAlign: 'center', lineHeight: 65, overflow: 'hidden' }, codeBox: { width: '100%', backgroundColor: C.soft, borderRadius: 16, padding: 14, alignItems: 'center', marginTop: 16 }, code: { color: C.aqua, fontSize: 21, fontWeight: '900', letterSpacing: 1, marginTop: 4 },
  tabs: { height: 76, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.line, flexDirection: 'row', paddingTop: 8 }, tab: { flex: 1, alignItems: 'center' }, tabIcon: { color: C.muted, fontSize: 20 }, tabText: { color: C.muted, fontSize: 9, fontWeight: '700', marginTop: 4 }, tabOn: { color: C.aqua },
});
