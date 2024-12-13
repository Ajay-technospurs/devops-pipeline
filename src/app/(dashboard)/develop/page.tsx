export const dynamic = 'force-dynamic'
import DevelopmentLayout from "@/views/develop/layout/layout";
const fetchProjects =async ()=>{
    const response = await fetch("http://localhost:3000/api/projects",{cache:"no-store"});
    if(response.ok)
    return await response.json()
    return []
}
const fetchPalettes =async ()=>{
    const response = await fetch("http://localhost:3000/api/palettes",{cache:"no-store"});
    return await response.json()
}
export default async function Page() {
    const [projects, palettes] = await Promise.all([
        fetchProjects(),
        fetchPalettes()
      ]);
    return (
        <DevelopmentLayout projects={projects} palettes={palettes}  />
    );
}