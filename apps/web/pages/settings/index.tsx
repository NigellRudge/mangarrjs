import { GetServerSideProps } from "next";
import Layout from "@/components/layouts/Layout";
import SettingsPage from "@/components/pages/SettingsPage";

const Page = ({}) => {
  return (
    <Layout>
      <SettingsPage />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Page;
