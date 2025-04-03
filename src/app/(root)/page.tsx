import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h2>Home page </h2>
      <p>Landing page </p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum mollitia sequi eaque iusto incidunt, veniam ex aut tenetur expedita! Nesciunt odit unde laudantium, asperiores deserunt quaerat obcaecati pariatur voluptatem tempore laborum amet debitis perferendis, architecto dolores ipsam illum eius vero, libero mollitia ex ducimus ad facilis cumque. Tempora, asperiores. Illum.</p>
      <button>
        <Link href='/sign-in'>Get Started</Link>
      </button>
    </div>
  );
}
