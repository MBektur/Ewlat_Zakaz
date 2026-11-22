bunu yaparken bir dusunelim, react/nextjs gerekli mi?

1. Ana prompt — Uygurca çocuk kitapları katalog sitesi
Aşağıdaki metni doğrudan kodlama ajanına gönder:
Proje: Uygurca Çocuk Kitapları Katalog ve Ön Sipariş Web Sitesi
Modern, estetik, güven veren ve kitapları ön plana çıkaran bir web sitesi geliştirmeni istiyorum.

Bu proje, Uygurca çocuk kitaplarının tanıtılması ve basım öncesinde ön sipariş toplanması amacıyla hazırlanacak.
1. Projenin genel yapısı
Elimizde 154'ten fazla Uygurca çocuk kitabı bulunuyor. Kitaplar farklı setlere ayrılmış durumda. Örneğin 80 kitaplık, 10 kitaplık, 12 kitaplık veya 4 kitaplık setler olabilir. Bunlar yalnızca örnektir; kesin set sayılarını ve kitap eşleşmelerini daha sonra sağlayacağım.

Sitenin amacı:
- Kitapları estetik bir şekilde sergilemek.
- Kullanıcıların kitapları ve setleri incelemesini sağlamak.
- Ön sipariş talebi toplamak.
- Kitapların basımı tamamlandıktan sonra kargo ile gönderileceğini açıklamak.
Şimdilik gerçek ödeme sistemi veya online satış entegrasyonu gerekmiyor.
2. Teknoloji tercihleri
- Next.js
- React
- TypeScript
- Tailwind CSS
- Swiper.js (kitap carousel sistemi)
- Lucide Icons
- Google Fonts – Lateef (Arap harfli Uygurca metinler için)
Kod yapısı temiz, bileşenlere ayrılmış ve ileride genişletilebilir olmalı.
3. Ana sayfa tasarımı
Ana sayfa bütün 154 kitabı aynı anda göstermemeli.

Bunun yerine:
- Sayfanın üst bölümünde etkileyici bir hero alanı olsun.
- Kitap koleksiyonunu tanıtan kısa bir başlık ve açıklama bulunsun.
- Hemen altında üç kitabın aynı anda göründüğü bir carousel yer alsın.
- Carousel Swiper.js ile geliştirilsin.
- Kitaplar sağdan sola doğru otomatik aksın.
- Kullanıcı fareyle sürükleyebilsin ve mobilde parmağıyla kaydırabilsin.
- Carousel üzerinde ileri/geri kontrolleri ve sayfa göstergesi bulunsun.
- Ana sayfada ayrıca "Tüm Kitapları Gör" bağlantısı olsun.
- Bu bağlantı ayrı katalog sayfasına götürsün.
Carousel sürekli ve akıcı çalışmalı. Otomatik hareket kullanıcı etkileşimi sırasında durmalı veya yavaşlamalı.
4. Kitap görsellerinin sunumu
Kitap kapakları düz görsellerdir. Bunları sıradan, düz dikdörtgen resimler olarak göstermek istemiyorum.

Kitapların gerçek kitap gibi görünmesini istiyorum:
- CSS 3D transform kullan.
- Kitap kapağına perspektif kazandır.
- Yan tarafta sayfa kalınlığını gösteren bir katman oluştur.
- Sayfa kenarlarında hafif doku ve çizgiler kullan.
- Kitapların altında doğal gölgeler bulunsun.
- Hover sırasında kitap hafifçe dönsün ve öne doğru gelsin.
- Animasyonlar zarif ve gerçekçi olsun.
- Abartılı, oyuncak gibi veya aşırı parlak efektler kullanma.
Three.js zorunlu değil. CSS 3D transform ile yeterli kalite elde edilebiliyorsa bunu tercih et.

ÖNEMLİ: Her kitabın gerçek boyut oranını koru. Bütün kitapları aynı en-boy oranına zorlayarak kapakları bozma. Kitapların farklı boyut ve kalınlıkları olabilir.
5. Tüm kitaplar sayfası
Ayrı bir katalog sayfası oluştur.

Bu sayfada:
- 154 kitabın tamamı listelenebilmeli.
- Kitaplar setlerine göre gruplandırılabilmeli.
- Her kitabın kapak görseli ve adı gösterilmeli.
- Kullanıcı setlere göre filtreleme yapabilmeli.
- Arama alanı bulunmalı.
- Mobil, tablet ve masaüstünde düzgün görünmeli.
Her kitap için ayrı detay sayfası oluşturma. Şimdilik kitap adı, set bilgisi ve kapak görseli yeterli.

Kitaplar için veri yapısını merkezi bir dosyada tut. Örneğin books.ts veya JSON. Böylece daha sonra gerçek kitap adlarını, setlerini ve görsellerini kolayca ekleyebileyim.

Elimde şu anda yalnızca iki gerçek kitap kapağı bulunuyor. Bu iki görseli örnek olarak kullan. Diğer kitaplar için gerçek kapak varmış gibi davranma; açıkça geçici placeholder görseller kullan.
6. Türkçe ve Uygurca dil desteği
Sitede Türkçe ve Arap harfli Uygurca dil seçenekleri bulunmalı.

Dil değiştirme butonu üst menüde yer alsın.

Türkçe:
- Normal LTR düzen.
Uygurca:
- Arap harfli Uygurca.
- Google Fonts üzerinden Lateef fontu.
- Sayfa yönü RTL olmalı.
- Metinler ve menüler sağdan sola hizalanmalı.
- Carousel ve gezinme kontrollerinin yönü RTL düzenine uygun olmalı.
Dil değiştirme işlemi sayfanın düzenini bozmamalı.

Henüz gerçek Uygurca çeviriler sağlanmadı. Bu nedenle Uygurca metinler için düzenlenebilir örnek içerik kullan ve gerçek çeviri gibi sunma.
7. Ön sipariş sistemi
Kullanıcılar ön sipariş talebi oluşturabilsin.

Formda şu alanlar bulunsun:
- Ad ve soyad
- Telefon numarası
- Teslimat adresi
- İlgilendiği kitap seti veya setleri
- Ek not (isteğe bağlı)
Formun yakınında şu bilgilendirme yer alsın:

"Kitaplarımız ön sipariş aşamasındadır. Basım süreci tamamlandıktan sonra siparişleriniz adresinize kargo ile gönderilecektir."

Şimdilik form yalnızca arayüz demosu olsun. Gerçek veri kaydetme veya sipariş gönderme sistemi kurma. Formun demo olduğunu açıkça belirt.
8. Tasarım dili
Tasarım sıradan bir e-ticaret şablonuna benzememeli.

İstediğim görsel yaklaşım:
- Modern, editoryal ve kültürel bir kitap koleksiyonu hissi.
- Sıcak, yumuşak ve pastel renkler.
- Krem, açık bej, kırık beyaz ve doğal kahverengi tonları.
- Kitap kapakları ana görsel odak olmalı.
- Yeterli boşluk kullan.
- Zarif tipografi.
- İnce gölgeler ve yumuşak geçişler.
- Güven veren, sade navigasyon.
Aşırı renkli çocuk sitesi görünümünden kaçın. Hedef kitle yalnızca çocuklar değil; kitapları satın alacak ebeveynler ve aileler de.
9. Responsive tasarım
Tüm sayfalar:
- Masaüstü
- Tablet
- Mobil
ekranlarda düzgün çalışmalı.

Mobilde carousel tek veya iki kitap gösterebilir. Masaüstünde üç kitap görünmeli.
10. Kod kalitesi ve çalışma yöntemi
Önce mevcut proje yapısını incele. Proje yoksa Next.js ve TypeScript ile oluştur.

Geliştirmeyi şu sırayla yap:
1. Genel tasarım sistemi ve renk paleti.
2. Header ve hero alanı.
3. Üç kitaplı Swiper carousel.
4. CSS 3D kitap bileşeni.
5. Tüm kitaplar katalog sayfası.
6. Türkçe/Uygurca dil geçişi ve RTL.
7. Ön sipariş formu.
8. Responsive düzen ve son kontroller.
Her özelliği tamamladıktan sonra uygulamayı çalıştırıp hataları kontrol et.

Bana yalnızca statik bir tasarım gösterme; çalışan, sayfalar arasında gezinilebilen bir web uygulaması oluştur.

Kodları gereksiz yere karmaşıklaştırma. İleride kitap bilgilerini ve görsellerini kolayca değiştirebileceğim bir yapı kur.




2. Tasarım kalitesini artırmak için ek prompt
İlk tasarım tamamlandıktan sonra aynı ajana şu ikinci promptu gönder:
Şimdi mevcut tasarımı bir üst seviyeye taşı.

Özellikle kitap sunumuna odaklan. Kitaplar sıradan görsel kartlar gibi değil, gerçek bir kitap koleksiyonu gibi görünmeli.

Her kitapta:
- Ön kapak görseli,
- Görünür kitap sırtı,
- Sayfa kalınlığı,
- Sayfa kenarlarında hafif çizgiler,
- Doğal perspektif,
- Gerçekçi zemin gölgesi
bulunsun.

Hover sırasında kitap hafifçe sağa veya sola dönsün, biraz yükselsin ve perspektif derinliği artsın. Animasyon kısa, akıcı ve zarif olsun.

Kitapların gerçek kapak oranlarını koru. Farklı boyutlardaki kitaplar yan yana geldiğinde doğal bir koleksiyon görünümü oluşsun.

Tasarımı çocuklara yönelik ucuz bir oyuncak sitesi gibi değil, kaliteli bir yayınevinin dijital kitap koleksiyonu gibi göster.

Mevcut işlevleri bozma. Önce mevcut kodu incele, sonra gerekli bileşenleri güncelle.




3. Kitap bilgilerini eklemek için üçüncü prompt
154 kitabın adlarını, setlerini ve kapak görsellerini hazırladığında kullan:
Şimdi sana 154 kitabın gerçek bilgilerini ve kapak görsellerini sağlayacağım.

Bunları mevcut projeye aktar.

Kurallar:
- Kitap adlarını değiştirme.
- Set eşleşmelerini değiştirme.
- Kitapları kendin farklı setlere dağıtma.
- Kapak görsellerini başka kitaplarla eşleştirme.
- Her kitabın gerçek görsel oranını koru.
- Eksik bilgileri uydurma; eksik olanları işaretle.
- Kitap verilerini merkezi bir veri dosyasında tut.
- Ana sayfadaki carousel'de seçili kitapları göster.
- Tüm kitaplar sayfasında 154 kitabın tamamını göster.
- Set filtrelerini gerçek set bilgilerine göre oluştur.
Verileri aktardıktan sonra kitap sayısını ve set dağılımını kontrol et. Sonuçları bana raporla.