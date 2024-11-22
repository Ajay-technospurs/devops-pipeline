// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { 
  getProjects, 
  createProject 
} from '@/lib/utils/file_operations';
export const dynamic = 'force-dynamic'; // Disable static optimization
export const revalidate = 0; // Disable cache

export async function GET() {
  try {
    const projects = await getProjects();
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
    };
    return NextResponse.json(projects,{headers});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json();
    const newProject = await createProject(projectData);
    const promise = await new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
      }, 1500)
    );
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
    };
    return NextResponse.json(newProject, { status: 201 ,headers});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

