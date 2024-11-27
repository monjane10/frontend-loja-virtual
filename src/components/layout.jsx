import { useState, useEffect } from 'react';
import { Menubar } from 'primereact/menubar';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Outlet, Link } from 'react-router-dom';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './Layout.css';
import logo from '../assets/logo3.jpg';

const Layout = () => {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = [
        {
            label: 'HOME',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-home',
                    path: '/dashboard', 
                },
            ]
        },
        {
            label: 'CADASTROS',
            icon: 'pi pi-folder',
            items: [
                { label: 'Provincias', icon: 'pi pi-fw pi-globe', path: '/provincias' },
                { label: 'Cidades', icon: 'pi pi-fw pi-building', path: '/cidades' },
                { label: 'Pessoas', icon: 'pi pi-fw pi-users', path: '/pessoas' },
                { label: 'Permissões', icon: 'pi pi-fw pi-tag', path: '/permissoes' },
                { label: 'Categorias', icon: 'pi pi-fw pi-tags', path: '/categorias' },
                { label: 'Produtos', icon: 'pi pi-fw pi-image', path: '/productos' },
                { label: 'Marcas', icon: 'pi pi-fw pi-tag', path: '/marcas' },
               
            ]
        },
    ];
    const menubarStart = (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            
            {/* Logo e Nome da Loja à Esquerda */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                    src={logo} 
                    alt="Logo"
                    style={{ width: '30px', height: '30px', marginRight: '0.5rem' }}
                />
                <span style={{ color: '#000000', fontSize: '20px' }}>
                    
                </span>
            </div>
    
            {/* Título Centralizado */}
            <div style={{ flex: 1, textAlign: 'center' }}>
                <h4 style={{
                    color: '#000000',
                    fontSize: '20px',
                    margin: 0,
                }}>
                    Painel Administrativo
                </h4>
            </div>
    
            {/* Espaço Vazio à Direita para Centralizar o Título */}
            <div style={{ width: '400px' }}></div>
        </div>
    );
    
    
    


    
    const menubarEnd = (
        <div>
            <Button icon="pi pi-calendar" className="p-button-text" />
            <Button icon="pi pi-cog" className="p-button-text" />
            <Button icon="pi pi-user" className="p-button-text" />
        </div>
    );

    return (
        <div className="layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Barra de navegação superior fixa */}
            <Menubar start={menubarStart} end={menubarEnd} className="layout-menubar" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                boxShadow: '0px 0.2px 0.2px rgba(0, 0, 0, 0.1)'
            }} />

            {/* Menu Lateral fixo, com responsividade */}
            <Sidebar 
                visible={isMobile ? sidebarVisible : true} 
                onHide={() => setSidebarVisible(false)} 
                className="layout-sidebar" 
                modal={isMobile} 
                showCloseIcon={false}
                style={{
                    position: isMobile ? 'absolute' : 'fixed',
                    top: '4rem',
                    left: 0,
                    bottom: 0,
                    width: isMobile ? '100%' : '300px',
                    backgroundColor: '#ffff',
                    zIndex: 900,
                    paddingTop: '1rem',
                    boxShadow: '0.2px 0px 0.2px rgba(0, 0, 0, 0.1)',
                    transition: 'left 0.3s ease',
                }}
            >
                {menuItems.map((category, index) => (
                    <div key={index} className="menu-category">
                        <h4>{category.label}</h4>
                        {category.items.map((item, subIndex) => (
                            <Link 
                                key={subIndex} 
                                to={item.path} 
                                className="p-button-text p-d-flex p-ai-center menu-item"
                                onClick={() => isMobile && setSidebarVisible(false)}
                                style={{
                                    margin: '0.4rem 0',
                                    padding: '0.4rem',
                                    width: '100%',
                                    textAlign: 'left',
                                    boxShadow: '0px 0.2px 0.2px rgba(0, 0, 0, 0.05)',
                                    display: 'block',
                                    color: '#6c757d',  // Cor cinza
                                    textDecoration: 'none',
                                }}
                            >
                                <Button label={item.label} icon={item.icon} className="p-button-text" />
                            </Link>
                        ))}
                    </div>
                ))}
            </Sidebar>

            {/* Conteúdo Principal com rolagem */}
            <div 
                className="layout-content" 
                style={{
                    marginLeft: isMobile ? 0 : '250px',
                    padding: '2rem',
                    overflowY: 'auto',
                    height: 'calc(100vh - 4rem)',
                    flexGrow: 1,
                }}
            >
                <Outlet /> {/* O conteúdo das páginas será renderizado aqui conforme as rotas */}
            </div>
        </div>
    );
};

export default Layout;
