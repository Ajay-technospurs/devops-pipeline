// app/api/projects/route.ts
import mongoose from 'mongoose';
import { Projects } from '@/mongodb/model/github';
import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic'; // Disable static optimization
export const revalidate = 0; // Disable cache

// export async function GET() {
//   try {
//     const projects = await getProjects();
//     const headers = {
//       'Cache-Control': 'no-cache, no-store, must-revalidate',
//       'Pragma': 'no-cache',
//     };
//     return NextResponse.json(projects,{headers});
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const projectData = await request.json();
//     const newProject = await createProject(projectData);
//     const promise = await new Promise<void>((resolve) =>
//       setTimeout(() => {
//         resolve();
//       }, 1500)
//     );
//     const headers = {
//       'Cache-Control': 'no-cache, no-store, must-revalidate',
//       'Pragma': 'no-cache',
//     };
//     return NextResponse.json(newProject, { status: 201 ,headers});
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
//   }
// }

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  console.log(process.env.MONGODB_URI,"process.env.MONGODB_URI");
  
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Could not connect to MongoDB');
  }
};

// Separate Functions for GET, POST, and DELETE
export async function GET() {
  await connectDB();

  try {
    const repositories = await Projects.find();
    console.log(repositories,"repositories");
    
    return Response.json(repositories);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch repositories' });
  }
}

export async function POST(request: Request) {
  await connectDB();

  try {
    
    const { owner, name, html_url, token, visibility } = await request.json();
    console.log(owner, name, html_url, token, visibility);

    // Check if repository already exists
    const existingRepo = await Projects.findOne({ url:html_url });
    if (existingRepo) {
      return  Response.json({ error: 'Projects already exists' });
    }
    const options = {
      owner:owner.login,
      name:name,
      repo:name,
      url:html_url,
      token: visibility=="private" ? token : undefined,
      isPrivate:visibility=="private",
    }
    const newRepository =await Projects.create(options)
    // await newRepository.save();
    console.log(JSON.stringify(newRepository.toObject(), null, 2),"newRepository",options);
    
    return Response.json({created:JSON.stringify(newRepository.toObject(), null, 2),body:options});
  } catch (error) {
    return Response.json({ error: 'Failed to add repository',err:JSON.stringify(error)});
  }
}

export async function DELETE(request: NextRequest) {
  await connectDB();

  try {
    const params=request.nextUrl.searchParams
    const data =  request.body;
    console.log(request.nextUrl.searchParams,params.get("id"));
    const id = params.get("id")
    
    
    await Projects.findByIdAndDelete(id);
    return Response.json({ message: 'Projects deleted successfully',id:id });
  } catch (error) {
    return Response.json({ error: 'Failed to delete repository' });
  }
}