export default function(){
    const names=[{id:1,title:"Yousef"},{id:2,title:"Ruaa"},{id:3,title:"R&Y"}];
    const myTaskList=names.map(name=>{
        return (<li style={{ background:"pink" }} key={name.id}>{name.title}</li>)
    });
    return(
<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="border-2 border-gray-400 rounded-lg p-4 w-64 text-center bg-white shadow-md">
    <h2>Rendering</h2>
     <div>
            <ul>
                    {myTaskList}
                </ul>
            </div>

  </div>

  </div>

    );
}