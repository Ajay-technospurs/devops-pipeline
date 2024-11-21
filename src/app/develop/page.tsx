import { getPaletteOptions, getProjects } from "@/lib/utils/file_operations";
import DevelopmentLayout from "@/views/develop/layout/layout";

export default async function Page() {
    const [projects, palettes] = await Promise.all([
        getProjects(),
        getPaletteOptions()
      ]);
    return (
        <DevelopmentLayout projects={projects} palettes={palettes}  />
    );
}