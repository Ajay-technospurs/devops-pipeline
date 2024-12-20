import { fetchProjectbyId } from "@/actions/projects";
import { GitHubProjectType } from "@/mongodb/model/github";
import PipeLineSection from "@/views/develop/pipeline_section/pipeline_section";
import { redirect, RedirectType } from "next/navigation";
import { FlowProvider } from "@/provider/canvas_provider";

export default async function Page({params:{projectId},searchParams:{child}}:{params:{projectId:string},searchParams:{child:string}}) {
    const project:GitHubProjectType = await fetchProjectbyId(projectId);
    const file = project?.children?.find((ele)=>ele?.name?.toString() == child)
    console.log(file,"data=================================",child);
    if(!project){
        redirect("/develop",RedirectType.replace)
    }
    return (
        <FlowProvider>
            <PipeLineSection project={project} file={file} />
        </FlowProvider>
    );
}