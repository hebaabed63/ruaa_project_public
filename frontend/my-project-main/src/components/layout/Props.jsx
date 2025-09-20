export default function({name,email,content="no content",children}){
    return(
<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="border-2 border-gray-400 rounded-lg p-4 w-64 text-center bg-white shadow-md">
    <h2>Props</h2>
  <p class="text-lg font-semibold mb-2">{name}</p>
  <p class="text-base text-gray-700">{email}</p>
   <p class="text-base text-gray-700">{content}</p>
   <hr></hr>
   <p class="text-base text-gray-700">{children}</p>
</div>
</div>
    );
}