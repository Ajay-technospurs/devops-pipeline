// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

import {
  getProjectById,
  updateProject,
  deleteProject,
} from "@/lib/utils/file_operations";
import { connectDB } from "../route";
import { GitHubProjectType, Projects } from "@/mongodb/model/github";

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
export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  await connectDB();

  try {
    const repositories = await Projects.findOne({ _id: id });
    console.log(repositories, "repositories");

    return Response.json(repositories);
  } catch (error) {
    return Response.json({ error: "Failed to fetch repositories" });
  }
}

export async function PUT(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  try {
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    let body: GitHubProjectType;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    if (!body || !body.name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    // Convert the document to a plain JavaScript object
    const existingProject:any = await Projects.findOne({ _id: id }).lean();
    
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Initialize children array if it doesn't exist
    if (!existingProject.children) {
      existingProject.children = [];
    }

    // Update logic
    const childIndex = existingProject.children.findIndex(
      (child:any) => child.name === body.name
    );

    if (childIndex === -1) {
      // Add new child
      existingProject.children.push(body);
    } else {
      // Update existing child
      existingProject.children[childIndex] = {
        ...existingProject.children[childIndex],
        ...body,
        updatedAt: new Date()
      };
    }

    // Use findOneAndUpdate instead of replaceOne
    const result = await Projects.findOneAndUpdate(
      { _id: id },
      { 
        $set: {
          children: existingProject.children,
          updatedAt: new Date()
        }
      },
      { 
        new: true,      // Return the updated document
        runValidators: true,
        lean: true      // Return a plain JavaScript object
      }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      data: result
    });

  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteProject(params.id);
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
