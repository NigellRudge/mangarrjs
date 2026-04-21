import Layout from "@/components/layouts/Layout";
import Grid from "@/components/list/Grid";
import useSearchGrid from "@/hooks/useSearchGrid";

const Page = ({}) => {
  const { results, isLoading, fetchMore } = useSearchGrid();

  return (
    <Layout>
      <Grid
        items={results}
        type="manga"
        onEndReached={fetchMore}
        isLoading={isLoading}
      />
    </Layout>
  );
};

export default Page;
