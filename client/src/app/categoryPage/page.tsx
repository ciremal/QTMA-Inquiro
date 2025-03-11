import { Suspense } from "react";
import CategoryPage from "./CategoryPage";

function Home() {
  return (
    <Suspense>
      <CategoryPage />
    </Suspense>
  );
}

export default Home;
