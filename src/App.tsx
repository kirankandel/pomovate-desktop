import React from "react";
import Layout from "@/components/Layout";
import Timer from "@/components/Timer";
import TaskList from "@/components/Tasks/TaskList";

const App: React.FC = () => {
  return (
    <Layout>
      <div className="mb-12">
        <Timer />
      </div>
      <div>
        <TaskList />
      </div>
    </Layout>
  );
};

export default App;
