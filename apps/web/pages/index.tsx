import { GetServerSideProps } from "next";
import Layout from "@/components/layouts/Layout";

import TrendingMangas from "@/components/list/sliders/TrendingMangasSlider";

export default function Page() {
  return (
    <Layout>
      <TrendingMangas />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
