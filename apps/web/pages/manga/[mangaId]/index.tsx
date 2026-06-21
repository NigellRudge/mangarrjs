import { GetServerSideProps } from "next";
import MangaDetailPage from "@/components/pages/MangaDetailPage";
import Layout from "@/layouts/Layout";
import { MangaInfoResponse, MangaSourceType } from "@mangarr/shared";
import { searchClient } from "@/http/search-client";

const Page = ({ manga }: { manga: MangaInfoResponse }) => {
  return (
    <Layout
      backgroundImage={{
        src: manga?.bannerImage,
        sourceId: manga?.sourceId,
      }}
    >
      <MangaDetailPage manga={manga} />;
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { mangaId } = context.query;
  if (!mangaId) {
    return {
      notFound: true,
    };
  }
  const [id, source] = mangaId.toString().split("_");

  if (!id || !source) {
    return {
      notFound: true,
    };
  }

  try {
    const manga = await searchClient.getInfo({
      id,
      source: source as MangaSourceType,
    });
    if (!manga) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        manga,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      notFound: true,
    };
  }
};

export default Page;
