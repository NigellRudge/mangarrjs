import { GetServerSideProps } from "next";
import Layout from "@/components/layouts/Layout";
import useNewChapters from "@/hooks/useNewChapters";
import Grid from "@/components/list/Grid";

export default function Page() {
  const { newChapters, isLoading, type } = useNewChapters();
  return (
    <Layout>
      <Grid type={type} isLoading={isLoading} items={newChapters} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
