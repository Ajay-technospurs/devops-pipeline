// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { 
    getProjectById, 
    updateProject, 
    deleteProject 
  } from '@/lib/utils/file_operations';
import { connectDB } from '../route';
import { Projects } from '@/mongodb/model/github';
  
  // export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  //   try {
  //     const project = await getProjectById(params.id);
  //     if (!project) {
  //       return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  //     }
  //     return NextResponse.json(project);
  //   } catch (error) {
  //     return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  //   }
  // }
  export async function GET(request: NextRequest, 
    { params:{id} }: { params: { id: string } }) {
    await connectDB();
  
    try {
      const repositories = await Projects.findOne({_id:id});
      console.log(repositories,"repositories");
      
      return Response.json(repositories);
    } catch (error) {
      return Response.json({ error: 'Failed to fetch repositories' });
    }
  }

  export async function PUT(
    request: NextRequest, 
    { params }: { params: { id: string } }
  ) {
    try {
      const projectData = await request.json();
      const updatedProject = await updateProject(params.id, projectData);
      if (!updatedProject) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json(updatedProject);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
  }
  
  export async function DELETE(
    _request: NextRequest, 
    { params }: { params: { id: string } }
  ) {
    try {
      await deleteProject(params.id);
      return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
  }