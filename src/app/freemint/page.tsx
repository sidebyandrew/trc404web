export default async function Page({params}: { params: { lang: string } }) {

    return (
        <div>
            <h1 className="">About {params.lang}</h1>
        </div>
    );
}
