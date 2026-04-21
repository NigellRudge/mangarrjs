import { GetServerSideProps } from "next";
import { MangaInfo, MangaSourceType } from "@/types/manga";
import MangaDetailPage from "@/components/pages/MangaDetailPage";
import DetailLayout from "@/components/layouts/DetailLayout";
import { backendClient } from "@/http/api-client";

const Page = ({ manga }: { manga: MangaInfo }) => {
  return (
    <DetailLayout backgroundImage={manga?.bannerImage}>
      <MangaDetailPage manga={manga} />;
    </DetailLayout>
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
    const manga = await backendClient.getInfo({
      id,
      source: source as MangaSourceType,
    });
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
