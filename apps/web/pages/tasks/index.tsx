import { GetServerSideProps } from "next";
import Layout from "@/components/layouts/Layout";

const Page = ({}) => {
  return <Layout>tasks</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default Page;
