const BreadCrumb = ({
  chapterTitle,
  mangaTitle,
}: {
  chapterTitle: string;
  mangaTitle: string;
}) => {
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        <li>
          <a>{mangaTitle}</a>
        </li>
        <li>{chapterTitle}</li>
      </ul>
    </div>
  );
};

export default BreadCrumb;
