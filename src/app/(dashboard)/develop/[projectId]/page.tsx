import { fetchProjectbyId } from "@/actions/projects";
import PipeLineSection from "@/views/develop/pipeline_section/pipeline_section";

export default async function Page({params:{projectId}}:{params:{projectId:string}}) {
    const project = await fetchProjectbyId(projectId)
    console.log(project,"data=================================");
    
    return (
        <PipeLineSection project={project} />
    );
}