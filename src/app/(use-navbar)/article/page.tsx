import { Hero } from "./components/Hero";
import { MostRead } from "./components/MostRead";
import { Recent } from "./components/Recent";

export default function Article() {
  return (
    <>
      <Hero />
      <Recent
        cover="/assets/post-thumbnail.png"
        title="Tips Berbelanja Tirai Yang Berkualitas"
        content="Tips Memilih Tirai yang Berkualitas – Tirai tidak hanya mempercantik ruangan, tetapi juga membantu mengatur pencahayaan dan privasi. Dengan berbagai pilihan yang tersedia, penting untuk memilih tirai yang sesuai kebutuhan. Pastikan untuk mempertimbangkan bahan dan fungsi. Tirai blackout cocok untuk kamar tidur, sedangkan tirai berbahan ringan lebih sesuai untuk ruang tamu yang membutuhkan pencahayaan alami."
        slug="tes"
        authorName="Rina Agustina"
        published_at={new Date()}
      />
      <MostRead />
    </>
  );
}
