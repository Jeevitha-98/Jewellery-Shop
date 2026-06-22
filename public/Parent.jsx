
import Child from "../src/Child";

export default function Parent() {
  const employees = [
    { name: "Arun", email: "arun@gmail.com", role: "Frontend Developer" },
    { name: "Priya", email: "priya@gmail.com", role: "UI/UX Designer" },
    { name: "Karthik", email: "karthik@gmail.com", role: "QA Tester" },
    { name: "Divya", email: "divya@gmail.com", role: "HR Manager" },
    { name: "Rahul", email: "rahul@gmail.com", role: "Team Lead" },
    {name: "Jeevitha", email:"jeevitha@gmail.com", role:"Full-Stack Developer"}
  ];

  return (
    <div className="container">
      <h1 className="title"><u>✨ Employee Directory</u></h1>

      <div className="card-container">
       <Child {...employees[0]}/>
       <Child {...employees[1]}/>
       <Child {...employees[2]}/>
       <Child {...employees [3]}/>
       <Child {...employees[4]}/>
       <Child {...employees[5]}/>


      </div>
    </div>
  );
}