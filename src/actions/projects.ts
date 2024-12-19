import axios from "axios";

export const fetchProjects = async () => {
  const response = await fetch("http://localhost:3000/api/projects", {
    cache: "no-store",
  });
  if (response.ok) return await response.json();
  return [];
};
export const fetchProjectbyId = async (id: string) => {
  const response = await fetch("http://localhost:3000/api/projects/" + id, {
    cache: "no-store",
  });
  if (response.ok) return await response.json();
  return null;
};
export const AddSubProjectbyId = async (id: string,body:any) => {
  const response = await axios.put("http://localhost:3000/api/projects/" + id,body);
 
  return response;
};