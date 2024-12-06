import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { useDrag } from "react-dnd";
import { useFlow } from "@/provider/canvas_provider";
import { DRAG_TYPES, GlobalInput } from "@/types/config";

interface DraggableCardProps {
  input: GlobalInput;
  onDelete?: (id: string) => void;
}

// Draggable Card Component
const DraggableCard: React.FC<DraggableCardProps> = ({ input, onDelete }) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: DRAG_TYPES.GLOBAL_INPUT,
    item: input,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Card
      ref={dragPreview as any}
      className={`mb-1 mx-2 relative ${isDragging ? "opacity-50" : ""}`}
    >
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-2">
        <div ref={drag as any} className="cursor-move mr-2">
          <GripVertical className="text-muted-foreground" />
        </div>
        <CardTitle className="text-sm flex-1 truncate">
          {input.key} : {input.value}
        </CardTitle>
        {onDelete && (
          <div className="flex items-center space-x-2">
            <Trash2
              onClick={(e) => {
                e.stopPropagation();
                onDelete(input.id);
              }}
              className="text-destructive cursor-pointer"
              size={16}
            />
          </div>
        )}
      </CardHeader>
    </Card>
  );
};
const DraggableOutputCard: React.FC<{output:string}> = ({ output }) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: DRAG_TYPES.OUTPUT,
    item: {objectKey:output,type:"output"},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Card
      ref={dragPreview as any}
      className={`mb-1 mx-2 relative ${isDragging ? "opacity-50" : ""}`}
    >
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-2">
        <div ref={drag as any} className="cursor-move mr-2">
          <GripVertical className="text-muted-foreground" />
        </div>
        <CardTitle className="text-sm flex-1 truncate">
          {output} 
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
// Main Component
export const AttributesTabsLayout: React.FC = () => {
  const { state, getPreviousNodes } = useFlow();
  const [globalInputs, setGlobalInputs] = useState<GlobalInput[]>([]);
  const [inputs, setInputs] = useState<GlobalInput[]>([]);
  const [outputs, setOutputs] = useState<string[]>([]);


  useEffect(() => {
    // Extract globalInputs from the selected node's data
    const globalInputs = state.nodes?.[0]?.data
      ?.globalInputs as Array<GlobalInput>;
    const userNodes = state.nodes?.filter(
      (ele) => ele.id !== "start" && ele.id !== "end"
    );
    const previousNodes = getPreviousNodes(state.selectedNode?.id ?? "");
    console.log(previousNodes,"previousNode");
    
    if (globalInputs) {
      const extractedInputs = globalInputs || [];
      // Transform the inputs to include an id for drag and drop
      const formattedInputs = extractedInputs?.map((input, index) => ({
        id: input.id,
        key: input.key,
        value: input.value,
        type: "global-input",
      }));

      setGlobalInputs(formattedInputs);
    }
    if (previousNodes.length == 0) {
      return;
    } else {
      let input: Array<GlobalInput> = [];
      let output: Array<string> = [];
      previousNodes.map((ele) => {
        const schema: any = ele.data?.schemaData;
        if (schema && schema?.inputs) {
          const arr = Object.entries(schema?.inputs).map((ele,index)=>({id:ele[0]??`index-${index}`,key:ele[0]??"",value:ele[1]??"",type:"global-input"}))
          arr.map((item)=>{
            input.push(item as GlobalInput)
          })
        }
        if (schema && schema?.outputs && schema?.outputs?.objectKeys) {
          schema?.outputs?.objectKeys?.map((item:string)=>{
            output.push(item);
           })
        }
      });
      setInputs(input);
      setOutputs(output)
    }
  }, [state]);

  const handleDelete = (id: string) => {
    setGlobalInputs((prev) => prev.filter((input) => input.id !== id));
  };
  const [tab,setTab] = useState("global");
  return (
    <Tabs
      defaultValue="global"
      className="w-full h-full flex flex-col min-h-0"
    >
      <TabsList className="flex w-full justify-start flex-shrink">
        <TabsTrigger onClick={()=>setTab("global")} value="global">Global</TabsTrigger>
        <TabsTrigger onClick={()=>setTab("inputs")} value="inputs">Inputs</TabsTrigger>
        <TabsTrigger onClick={()=>setTab("outputs")} value="outputs">Outputs</TabsTrigger>
      </TabsList>

     {tab=="global"&& <TabsContent
        className="flex-1 space-y-2 flex flex-col overflow-y-auto min-h-0 pb-4"
        value="global"
      >
        {globalInputs.map((input) => (
          <DraggableCard key={input.id} input={input} onDelete={handleDelete} />
        ))}
      </TabsContent>}

      {tab=="inputs"&& <TabsContent
        className="flex-1 space-y-2 flex flex-col overflow-y-auto min-h-0 pb-4"
        value="inputs"
      >
        {inputs.map((input) => (
          <DraggableCard key={input.id} input={input} onDelete={handleDelete} />
        ))}
      </TabsContent>}

      {tab=="outputs"&&<TabsContent
        className="flex-1 space-y-2 flex flex-col overflow-y-auto min-h-0 pb-4"
        value="outputs"
      >
        {outputs.map((output) => (
          <DraggableOutputCard key={output} output={output} />
        ))}
      </TabsContent>}
    </Tabs>
  );
};

export default AttributesTabsLayout;
