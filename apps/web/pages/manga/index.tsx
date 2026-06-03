import Layout from "@/layouts/Layout";
import { GetServerSideProps } from "next";
import DiscoverPage from "@/components/pages/DiscoverPage";
import DiscoverProvider from "@/providers/DiscoverProvider";

export default function Page() {
  return (
    <Layout>
      <DiscoverProvider>
        <DiscoverPage />
      </DiscoverProvider>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
