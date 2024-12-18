export const fetchPalettes =async ()=>{
    const response = await fetch("http://localhost:3000/api/palettes",{cache:"no-store"});
    return await response.json()
}