import Layout from "@/layouts/Layout";

export default function Page() {
  return (
    <Layout>
      <div className="flex flex-col gap-2 items-center justify-center h-full">
        <h1 className="text-3xl text-gray-100 font-bold">Not Found</h1>
        <span className="text-gray-300 font-medium text-md">
          Could not locate the requested resource
        </span>
      </div>
    </Layout>
  );
}
