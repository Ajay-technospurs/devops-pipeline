// lib/utils/file-operations.ts
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const PROJECT_FILE_PATH = path.join(process.cwd(), 'lib', 'data', 'projects.json');
const PALETTE_FILE_PATH = path.join(process.cwd(), 'lib', 'data', 'palette.json');

export async function readJsonFile(filePath: string) {
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading file:', error);
    return [];
  }
}

export async function writeJsonFile(filePath: string, data: any[]) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing file:', error);
  }
}

export async function getProjects() {
  return readJsonFile(PROJECT_FILE_PATH);
}

export async function getPaletteOptions() {
  return readJsonFile(PALETTE_FILE_PATH);
}

export async function getProjectById(id: string) {
  const projects = await getProjects();
  return projects.find((project: any) => project.id === id);
}

export async function getPaletteOptionById(id: string) {
  const paletteOptions = await getPaletteOptions();
  return paletteOptions.find((option: any) => option.id === id);
}

export async function createProject(project: any) {
  const projects = await getProjects();
  const newProject = { ...project, id: uuidv4() };
  projects.push(newProject);
  await writeJsonFile(PROJECT_FILE_PATH, projects);
  return newProject;
}

export async function createPaletteOption(option: any) {
  const paletteOptions = await getPaletteOptions();
  const newOption = { ...option, id: uuidv4() };
  paletteOptions.push(newOption);
  await writeJsonFile(PALETTE_FILE_PATH, paletteOptions);
  return newOption;
}

export async function updateProject(id: string, updatedProject: any) {
  const projects = await getProjects();
  const index = projects.findIndex((p: any) => p.id === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updatedProject };
    await writeJsonFile(PROJECT_FILE_PATH, projects);
    return projects[index];
  }
  return null;
}

export async function updatePaletteOption(id: string, updatedOption: any) {
  const paletteOptions = await getPaletteOptions();
  const index = paletteOptions.findIndex((p: any) => p.id === id);
  if (index !== -1) {
    paletteOptions[index] = { ...paletteOptions[index], ...updatedOption };
    await writeJsonFile(PALETTE_FILE_PATH, paletteOptions);
    return paletteOptions[index];
  }
  return null;
}

export async function deleteProject(id: string) {
  const projects = await getProjects();
  const filteredProjects = projects.filter((p: any) => p.id !== id);
  await writeJsonFile(PROJECT_FILE_PATH, filteredProjects);
  return filteredProjects;
}

export async function deletePaletteOption(id: string) {
  const paletteOptions = await getPaletteOptions();
  const filteredOptions = paletteOptions.filter((p: any) => p.id !== id);
  await writeJsonFile(PALETTE_FILE_PATH, filteredOptions);
  return filteredOptions;
}