import { useState } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Chart } from 'primereact/chart';
import { InputText } from 'primereact/inputtext';
import { PrimeIcons } from 'primereact/api';
import "../../App.css";

const Dashboard = () => {
    const initialSales = [
        { image: 'bamboo-watch.jpg', name: 'Relógio de Bambu', price: '16500.00Mzn' },
        { image: 'black-watch.jpg', name: 'Relógio Preto', price: '1720.00Mzn' },
        { image: 'blue-band.jpg', name: 'Pulseira Azul', price: '1790.00Mzn' },
        { image: 'blue-tshirt.jpg', name: 'T-Shirt Azul', price: '2290.00Mzn' },
        { image: 'bracelet.jpg', name: 'Pulseira', price: '1500.00Mzn' }
    ];

    const [recentSales, setRecentSales] = useState(initialSales);
    const [searchSalesQuery, setSearchSalesQuery] = useState('');

    const handleSalesSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchSalesQuery(query);

        if (query) {
            const filteredSales = initialSales.filter((sale) =>
                sale.name.toLowerCase().includes(query) || sale.price.toLowerCase().includes(query)
            );
            setRecentSales(filteredSales);
        } else {
            setRecentSales(initialSales);
        }
    };

    const chartData = {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'],
        datasets: [
            {
                label: 'Primeiro Conjunto de Dados',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: '#42A5F5',
                tension: 0.4
            },
            {
                label: 'Segundo Conjunto de Dados',
                data: [28, 48, 40, 19, 86, 27, 90],
                fill: false,
                borderColor: '#66BB6A',
                tension: 0.4
            }
        ]
    };

    const initialNotifications = [
        { text: "Richard Jones comprou uma camiseta azul por 799Mzn.", type: "purchase" },
        { text: "Sua solicitação de retirada de 2500 Mzn foi iniciada.", type: "withdrawal" },
        { text: "Keyser Wick comprou uma jaqueta preta por 4999 Mzn.", type: "purchase" }
    ];

    const [notifications, setNotifications] = useState(initialNotifications);
    const [searchNotificationsQuery, setSearchNotificationsQuery] = useState('');

    const handleNotificationsSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchNotificationsQuery(query);

        if (query) {
            const filteredNotifications = initialNotifications.filter((notification) =>
                notification.text.toLowerCase().includes(query)
            );
            setNotifications(filteredNotifications);
        } else {
            setNotifications(initialNotifications);
        }
    };

    // Dados para produtos mais vendidos
    const topProducts = [
        { image: 'black-watch.jpg', name: 'Relógio Preto', sales: 120 },
        { image: 'blue-tshirt.jpg', name: 'T-Shirt Azul', sales: 95 },
        { image: 'bracelet.jpg', name: 'Pulseira', sales: 90 },
        { image: 'bamboo-watch.jpg', name: 'Relógio de Bambu', sales: 85 },
        { image: 'blue-band.jpg', name: 'Pulseira Azul', sales: 75 }
    ];

    return (
        <div className="dashboard">
            <div className="stats-cards">
                <Card title="Pedidos" subTitle="210">
                    <div className="card-icon">
                        <i className={`pi ${PrimeIcons.SHOPPING_CART}`} style={{ color: '#28a745' }}></i>
                    </div>
                    <p style={{color: '#007bff'}}><span style={{color: '#28a745'}}>152 novos</span>  desde ontem</p>
                </Card>
                <Card title="Receita" subTitle="2100Mzn">
                    <div className="card-icon">
                        <i className={`pi ${PrimeIcons.CHART_LINE}`} style={{ color: '#ffc107' }}></i>
                    </div>
                    <p style={{color: '#007bff'}}><span style={{color: '#28a745'}}>+52% </span>Última semana </p>
                </Card>
                <Card title="Clientes" subTitle="28441">
                    <div className="card-icon">
                        <i className={`pi ${PrimeIcons.USERS}`} style={{ color: '#6c757d' }}></i>
                    </div>
                    <p style={{color: '#007bff'}}> <span style={{color: '#28a745'}}>1520</span> Recentes</p>
                </Card>
                <Card title="Comentários" subTitle="152 Não lidos">
                    <div className="card-icon">
                        <i className={`pi ${PrimeIcons.COMMENTS}`} style={{ color: '#007bff' }}></i>
                    </div>
                    <p style={{color: '#007bff'}}><span style={{color: '#28a745'}}>83</span> Respondidos</p>
                </Card>
            </div>

            <div className="content-sections">
                <Panel header="Vendas Recentes">
                    <div style={{ marginBottom: '10px' }}>
                        <InputText
                            value={searchSalesQuery}
                            onChange={handleSalesSearch}
                            placeholder="Pesquisar Vendas..."
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <DataTable value={recentSales} responsiveLayout="scroll">
                        <Column field="image" header="Imagem" body={(data) => <img src={data.image} alt={data.name} width="50" />} />
                        <Column field="name" header="Nome" />
                        <Column field="price" header="Preço" />
                    </DataTable>
                </Panel>

                <Panel header="Visão Geral de Vendas">
                    <Chart type="line" data={chartData} />
                </Panel>
            </div>

            <div className="notifications-and-top-products" style={{ display: 'flex', gap: '4%' }}>
                <Panel header="Notificações" style={{ flex: 1 }}>
                    <div style={{ marginBottom: '10px' }}>
                        <InputText
                            value={searchNotificationsQuery}
                            onChange={handleNotificationsSearch}
                            placeholder="Pesquisar Notificações..."
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    {notifications.map((notification, index) => (
                        <p key={index}>{notification.text}</p>
                    ))}
                </Panel>

                <Panel header="Produtos Mais Vendidos" style={{ flex: 1 }}>
                    <DataTable value={topProducts} responsiveLayout="scroll">
                        <Column field="image" header="Imagem" body={(data) => <img src={data.image} alt={data.name} width="50" />} />
                        <Column field="name" header="Nome" />
                        <Column field="sales" header="Vendas" />
                    </DataTable>
                </Panel>
            </div>
        </div>
    );
};

export default Dashboard;
