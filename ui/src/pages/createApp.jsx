import { Card, Title, Button } from "@tremor/react";
import { useState, useEffect } from "react";
import { Get, Post } from "../lib/https.jsx";

export default function CreateApp({ title }) {
    const [data, setData] = useState();
    const [formData, setFormData] = useState({
        repository: '',
        tag: '',
    });
    const [currentStep, setCurrentStep] = useState(1);

    const id = window.location.pathname.split('/').pop();

    async function getData() {
        const res = await Get("/marketplace/app/" + id);
        console.log(id, res)
        setData(res.app)
        handleInputChange('repository', res.app.Repository);
        handleInputChange('tag', res.app.Tag);
    }
    const handleInputChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    useEffect(() => {
        getData()
    }, [])

    const [envData, setEnvData] = useState([{ key: '', value: '' }]);

    const addRow = () => {
      setEnvData([...envData, { key: '', value: '' }]);
    };
  
    const handleEnvChange = (index, field, value) => {
      const newData = [...envData];
      newData[index][field] = value;
      setData(newData);
    };

   async function handleCreateApp() {
        const body  = {
            "image": formData.repository,
            "tag": formData.tag,
            "config": {
                "inside_port": "7700",
                "env": envData.map(n=>(n.key + "=" + n.value))
            }
        }
        const res = await Post("/deploy", body);
        console.log("APP CREATION: ", res)
    }

    return (
        <Card>
            <Title className="mb-5">Create {data?.Name} App</Title>
            {/*     <Button className="mt-5" size="lg">Create App</Button>
 */}    <div class="flex p-5">
                <div class="w-1/3">
                    <ol class="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">

                        <li class="mb-10 ms-6">
                            <span class="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                                <svg class="w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5" />
                                </svg>
                            </span>
                            <h3 class="font-medium leading-tight">Resources</h3>
                        </li>
                        <li class="mb-10 ms-6">
                            <span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                                <svg class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                    <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
                                </svg>
                            </span>
                            <h3 class="font-medium leading-tight">Environment Variables</h3>
                        </li>
{/*                         <li class="mb-10 ms-6">
                            <span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                                <svg class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                                </svg>
                            </span>
                            <h3 class="font-medium leading-tight">Info</h3>
                        </li> */}
                       {/*  <li class="ms-6">
                            <span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                                <svg class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
                                </svg>
                            </span>
                            <h3 class="font-medium leading-tight">Review</h3>
                        </li> */}

                    </ol>
                </div>
                <div class="w-2/3 border-l border-gray-200 dark:border-gray-700 p-8">
                    <div class="grid gap-6 mb-6 md:grid-cols-1">
                        {currentStep === 1 && (
                            <>
                                <div>
                                    <label for="repository" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repository</label>
                                    <input
                                        value={formData.repository}
                                        onChange={(e) => handleInputChange('repository', e.target.value)}
                                        type="text" id="repository" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="hub-name/repo-name" required />
                                </div>
                                <div>
                                    <label for="tag" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tag</label>
                                    <input
                                        value={formData.tag}
                                        onChange={(e) => handleInputChange('tag', e.target.value)}
                                        type="text" id="tag" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="latest" />
                                </div>
                            </>
                        )}
                        {currentStep === 2 && (
                            <>
                                <div>
                                    {envData.map((row, index) => (
                                        <div key={index} className="flex items-center mb-2">
                                            <input
                                                type="text"
                                                placeholder="Key"
                                                className="border p-2 mr-2"
                                                value={row.key}
                                                onChange={(e) => handleEnvChange(index, 'key', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Value"
                                                className="border p-2 mr-2"
                                                value={row.value}
                                                onChange={(e) => handleEnvChange(index, 'value', e.target.value)}
                                            />
                                            {index === data.length - 1 && (
                                                <button className="bg-blue-500 text-white p-2" onClick={addRow}>
                                                    +
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <Button
                        className="mt-5 mr-5"
                        disabled={currentStep <= 1}
                        size="lg"
                        onClick={() => setCurrentStep((prevStep) => prevStep - 1)}
                    >
                        Previous
                    </Button>
                    <Button onClick={currentStep <= 1 ? () => setCurrentStep(currentStep + 1) : handleCreateApp} className="mt-5" size="lg">{currentStep <= 1 ? "Next" : "Create app"}</Button>
                </div>
            </div>

        </Card>
    )
}