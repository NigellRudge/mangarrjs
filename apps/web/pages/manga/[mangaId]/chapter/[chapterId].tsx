import { GetServerSideProps } from "next";

export default function Page({ chapterId }: { chapterId?: string }) {
  return <div>{chapterId}</div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const chapterId = context.query.chapterId;

  return {
    props: {
      chapterId,
    },
  };
};
