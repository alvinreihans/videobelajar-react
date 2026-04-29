import { Accordion } from '../components/ui/Accordion';

function SocialIcon({ src, alt }) {
  return (
    <button
      type="button"
      className="w-9 h-9 rounded-full border border-text-dark-primary/30 flex items-center justify-center hover:bg-gray-100 transition shrink-0">
      <img src={src} alt={alt} className="w-5 h-5" />
    </button>
  );
}

export default function Footer() {
  const accordionItems = [
    {
      key: 'kategori',
      title: 'Kategori',
      content: (
        <>
          <span>Pemasaran</span>
          <span>Desain</span>
          <span>Pengembangan Diri</span>
          <span>Bisnis</span>
        </>
      ),
    },
    {
      key: 'perusahaan',
      title: 'Perusahaan',
      content: (
        <>
          <span>Tentang Kami</span>
          <span>FAQ</span>
          <span>Kebijakan Privasi</span>
          <span>Ketentuan Layanan</span>
          <span>Bantuan</span>
        </>
      ),
    },
    {
      key: 'komunitas',
      title: 'Komunitas',
      content: (
        <>
          <span>Tips Sukses</span>
          <span>Blog</span>
        </>
      ),
    },
  ];

  return (
    <footer
      className="
      w-full border-t border-border bg-white
      px-5 py-6
      md:px-[120px] md:py-[60px]
      flex flex-col items-center gap-6
    ">
      {/* TOP */}
      <div
        className="
        w-full max-w-[1200px]
        flex flex-col gap-6
        md:flex-row md:justify-between md:gap-[74px]
      ">
        {/* LEFT */}
        <div className="flex flex-col gap-4 w-full md:max-w-[352px]">
          <img src="/logo.svg" className="w-[170px] md:w-[200px]" />

          <div className="flex flex-col gap-2 text-text-dark-primary text-sm md:text-base font-sans">
            <p className="font-bold md:text-lg">
              Gali Potensi Anda Melalui Pembelajaran Video di hariesok.id!
            </p>
            <p className="font-normal">
              Jl. Usman Effendi No. 50 Lowokwaru, Malang
            </p>
            <p className="font-normal">+62-877-7123-1234</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full">
          {/* MOBILE → ACCORDION */}
          <div className="md:hidden">
            <Accordion items={accordionItems} />
          </div>

          {/* DESKTOP → GRID */}
          <div className="hidden md:flex gap-12">
            <div className="flex flex-col gap-3 font-sans">
              <p className="font-bold">Kategori</p>
              <div className="flex flex-col gap-2 text-text-dark-secondary">
                <span className="font-normal">Pemasaran</span>
                <span className="font-normal">Desain</span>
                <span className="font-normal">Pengembangan Diri</span>
                <span className="font-normal">Bisnis</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 font-sans">
              <p className="font-bold">Perusahaan</p>
              <div className="flex flex-col gap-2 text-text-dark-secondary">
                <span className="font-normal">Tentang Kami</span>
                <span className="font-normal">FAQ</span>
                <span className="font-normal">Kebijakan Privasi</span>
                <span className="font-normal">Ketentuan Layanan</span>
                <span className="font-normal">Bantuan</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 font-sans">
              <p className="font-bold">Komunitas</p>
              <div className="flex flex-col gap-2 text-text-dark-secondary">
                <span className="font-normal">Tips Sukses</span>
                <span className="font-normal">Blog</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="w-full max-w-[1200px]">
        <div className="h-[1px] bg-border w-full" />
      </div>

      {/* BOTTOM */}
      <div
        className="
        w-full max-w-[1200px]
        flex flex-col gap-4
        md:flex-row md:justify-between md:items-center
      ">
        <div className="flex gap-3 order-1 md:order-2">
          <a href="https://www.linkedin.com/">
            <SocialIcon src="/icon-linkedin.svg" alt="LinkedIn" />
          </a>
          <a href="https://www.facebook.com/">
            <SocialIcon src="/icon-facebook.svg" alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/">
            {' '}
            <SocialIcon src="/icon-instagram.svg" alt="Instagram" />
          </a>
          <a href="https://www.x.com/">
            <SocialIcon src="/icon-twitter.svg" alt="Twitter" />
          </a>
        </div>

        <p className="text-text-dark-secondary text-sm md:text-base order-2 md:order-1 font-sans">
          @2023 Gerobak Sayur All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
