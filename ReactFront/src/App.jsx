import FormSectionDB from "./component/FormSection/FormSectionDB";
import './App.css'
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import TableSectionDB from "./component/TableSection/TableSectionDB";
import DevSection from "./component/DevSection/DevSection";
import TableSection from "./component/TableSection/TableSection";
import FormSection from "./component/FormSection/FormSection";

export default function App() {
    return (
        <>
            <main className="main-page">
                <div className="route-container">
                    <Tabs aria-label="Options" size="sm" className="bg-dark">
                        <Tab key="form_DB" title="Форма_DB">
                            <Card >
                                <CardBody >
                                    <FormSectionDB />
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="table_DB" title="Таблица_DB">
                            <Card>
                                <CardBody>
                                    <TableSectionDB />
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="form" title="Форма">
                            <Card >
                                <CardBody >
                                    <FormSection />
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="table" title="Таблица">
                            <Card>
                                <CardBody>
                                    <TableSection />
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="dev" title="DevTools">
                            <Card>
                                <CardBody>
                                    <DevSection />
                                </CardBody>
                            </Card>
                        </Tab>
                    </Tabs>
                </div>
            </main>
        </>
    )
}
