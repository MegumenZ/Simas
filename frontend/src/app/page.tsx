"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiInbox, FiUsers, FiFilePlus } from "react-icons/fi";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center px-4">
      <section className="w-full max-w-5xl space-y-8 md:space-y-12 py-8 md:py-16 text-center">
        <div className="space-y-4 md:space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-700"
          >
            Selamat Datang di SIMAS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4"
          >
            SIMAS (Sistem Manajemen Surat) adalah sistem berbentuk website
            digital yang digunakan untuk mengelola surat SENAPATI secara modern,
            aman, dan efisien.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/login">
              <button className="mt-4 px-6 py-2.5 md:px-7 md:py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition font-medium text-sm md:text-base">
                Masuk ke SIMAS
              </button>
            </Link>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-4 md:px-6">
            {[
              {
                icon: (
                  <FiInbox className="text-blue-600 text-3xl md:text-4xl mb-3 mx-auto" />
                ),
                title: "Manajemen Surat",
                desc: "Kelola manajemen surat secara terstruktur.",
              },
              {
                icon: (
                  <FiUsers className="text-purple-600 text-3xl md:text-4xl mb-3 mx-auto" />
                ),
                title: "Manajemen Penerima",
                desc: "Atur data instansi penerima dengan mudah.",
              },
              {
                icon: (
                  <FiFilePlus className="text-yellow-600 text-3xl md:text-4xl mb-3 mx-auto" />
                ),
                title: "Input Surat Baru",
                desc: "Tambahkan surat baru hanya dalam beberapa klik.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="bg-white border rounded-xl p-4 md:p-6 text-center shadow-sm hover:shadow-md"
              >
                {feature.icon}
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
          <Footer />
        </motion.div>
      </section>
    </main>
  );
}

const Footer = () => {
  const developers = [
    { name: "Falih Dzakwan Zuhdi", url: "https://github.com/falihdzakwanz" },
    { name: "Bayu Ega Ferdana", url: "https://github.com/bayuega" },
    { name: "Sakti Mujahid Imani", url: "https://github.com/Sakti-122140123" },
    {
      name: "Muhammad Fadhil Zurani",
      url: "https://github.com/mfadhilzurani122140146",
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-xs text-gray-500 mt-4 text-center pt-6 leading-relaxed space-y-2"
    >
      <p>
        &copy; {new Date().getFullYear()} SIMAS - KOMINFO Pemerintah Kota Bandar
        Lampung.
      </p>

      <p>Daftar Pengembang</p>

      <div className="flex justify-center items-center flex-wrap gap-x-2 mt-1">
        {developers.map((dev, index) => (
          <div key={dev.url} className="flex items-center">
            <motion.a
              href={dev.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-gray-600 hover:text-blue-500 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {dev.name}
            </motion.a>
            {index < developers.length - 1 && (
              <motion.span
                className="text-black text-sm mx-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                •
              </motion.span>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <a
          href="http://if.itera.ac.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-gray-600 hover:text-blue-500 transition-colors duration-300 inline-block"
        >
          Teknik Informatika
        </a>
        <span> - Institut Teknologi Sumatera.</span>
      </div>
    </motion.footer>
  );
};
