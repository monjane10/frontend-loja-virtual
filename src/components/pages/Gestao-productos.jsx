import { useState, useEffect, useRef } from 'react';
import { Button, Dialog, InputText, DataTable, Column, Card } from 'primereact';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { Toast } from 'primereact/toast';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    descricao: '',
    valorCusto: '',
    valorVenda: '',
    categoria: '',
    marca: '',
    dataCriacao: '',
    dataActualizacao: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toastRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/producto/listar')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar produtos: ' + error.message });
      });

    axios.get('http://localhost:8080/api/categoria/listar')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar categorias: ' + error.message });
      });

    axios.get('http://localhost:8080/api/marca/listar')
      .then(response => {
        setBrands(response.data);
      })
      .catch(error => {
        toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar marcas: ' + error.message });
      });
  }, []);

  const handleAddProduct = () => {
    const updatedFormData = {
      ...formData,
      categoria: { id: formData.categoria },
      marca: { id: formData.marca },
      dataCriacao: formData.dataCriacao,
      dataActualizacao: formData.dataActualizacao,
    };

    if (isEditing) {
      axios.put('http://localhost:8080/api/producto/actualizar', updatedFormData)
        .then(response => {
          setProducts(products.map(product => product.id === formData.id ? response.data : product));
          setShowDialog(false);
          resetForm();
          toastRef.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Produto atualizado com sucesso!' });
        })
        .catch(error => {
          toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar produto: ' + error.message });
        });
    } else {
      axios.post('http://localhost:8080/api/producto/adicionar', updatedFormData)
        .then(response => {
          setProducts([...products, response.data]);
          setShowDialog(false);
          resetForm();
          toastRef.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Produto adicionado com sucesso!' });
        })
        .catch(error => {
          toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar produto: ' + error.message });
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    setFormData({
      ...product,
      categoria: product.categoria?.id || '',
      marca: product.marca?.id || '',
    });
    setIsEditing(true);
    setShowDialog(true);
  };

  const handleDeleteProduct = () => {
    axios.delete(`http://localhost:8080/api/product/${productToDelete}`)
      .then(() => {
        setProducts(products.filter(product => product.id !== productToDelete));
        setShowDeleteDialog(false);
        toastRef.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Produto excluído com sucesso!' });
      })
      .catch(error => {
        toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar produto: ' + error.message });
        setShowDeleteDialog(false);
      });
  };

  const confirmDelete = (productId) => {
    setProductToDelete(productId);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      nome: '',
      descricao: '',
      valorCusto: '',
      valorVenda: '',
      categoria: '',
      marca: '',
      dataCriacao: '',
      dataActualizacao: '',
    });
    setIsEditing(false);
  };

  const filteredProducts = products.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'stretch', minHeight: '100vh', backgroundColor: '#f0f0f0', padding: '20px' }}>
      <Box sx={{ margin: '2 auto', width: '100%', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Card title="Produtos" style={{ flex: 1, padding: '2rem', background: '#fff', borderRadius: '16px', boxShadow: '0 0.2px 0.2px rgba(0, 0, 0, 0.1)', height: '100%' }}>
          <Typography variant="h4" component="h2" gutterBottom style={{ marginBottom: '20px', textAlign: 'center' }} />
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome"
              style={{ width: '300px', borderRadius: '8px', padding: '10px', background: '#f7f7f7', border: '1px solid #e0e0e0' }}
            />
          </div>

          <Button
            label="Adicionar Produto"
            icon="pi pi-plus"
            onClick={() => { resetForm(); setShowDialog(true); }}
            style={{ backgroundColor: '#ff4d94', borderColor: '#ff4d94', marginBottom: '20px', padding: '10px 20px' }}
          />

          <DataTable value={filteredProducts} paginator rows={10} responsiveLayout="scroll" style={{ width: '100%' }}>
            <Column field="nome" header="Nome" />
            <Column field="descricao" header="Descrição" />
            <Column field="valorCusto" header="Valor Custo" />
            <Column field="valorVenda" header="Valor Venda" />
            <Column field="categoria.nome" header="Categoria" />
            <Column field="marca.nome" header="Marca" />
            <Column field="dataCriacao" header="Data de Criação" body={(rowData) => new Date(rowData.dataCriacao).toLocaleString()} />
            <Column
              header="Ações"
              body={(rowData) => (
                <div>
                  <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => handleEditProduct(rowData.id)} style={{ marginRight: '10px' }} />
                  <Button icon="pi pi-trash" className="p-button-rounded p-button-text" onClick={() => confirmDelete(rowData.id)} />
                </div>
              )}
            />
          </DataTable>
        </Card>

        <Dialog header={isEditing ? "Editar Produto" : "Adicionar Produto"} visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
          <div>
            <div className="p-field">
              <label htmlFor="nome">Nome do Produto</label>
              <InputText id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required style={{ width: '100%' }} />
            </div>
            <div className="p-field">
              <label htmlFor="descricao">Descrição</label>
              <InputText id="descricao" name="descricao" value={formData.descricao} onChange={handleInputChange} style={{ width: '100%' }} />
            </div>
            <div className="p-field">
              <label htmlFor="valorCusto">Valor de Custo</label>
              <InputText id="valorCusto" name="valorCusto" type="number" value={formData.valorCusto} onChange={handleInputChange} style={{ width: '100%' }} />
            </div>
            <div className="p-field">
              <label htmlFor="valorVenda">Valor de Venda</label>
              <InputText id="valorVenda" name="valorVenda" type="number" value={formData.valorVenda} onChange={handleInputChange} style={{ width: '100%' }} />
            </div>
            <div className="p-field">
              <label htmlFor="marca">Marca</label>
              <select name="marca" value={formData.marca} onChange={handleInputChange} style={{ width: '100%', outline:'none', padding:'0.5rem' }}>
                <option value="" style={{padding:'0.2rem'}}>Selecione uma marca</option>
                {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.nome}</option>)}
              </select>
            </div>
            <div className="p-field">
              <label htmlFor="categoria">Categoria</label>
              <select name="categoria" value={formData.categoria} onChange={handleInputChange} style={{ width: '100%', outline:'none', padding:'0.5rem' }}>
                <option value="" style={{padding:'0.2rem'}}>Selecione uma categoria</option>
                {categories.map(category => <option key={category.id} value={category.id}>{category.nome}</option>)}
              </select>
            </div>
            <Button label={isEditing ? "Atualizar" : "Adicionar"} icon="pi pi-check" onClick={handleAddProduct} style={{ width: '100%' }} />
          </div>
        </Dialog>

        <Dialog visible={showDeleteDialog} header="Confirmar Exclusão" modal footer={
          <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowDeleteDialog(false)} />
            <Button label="Excluir" icon="pi pi-check" onClick={handleDeleteProduct} style={{ backgroundColor: '#ff4d94', borderColor: '#ff4d94' }} />
          </div>
        } onHide={() => setShowDeleteDialog(false)}>
          <p>Tem certeza de que deseja excluir este produto?</p>
        </Dialog>

        <Toast ref={toastRef} />
      </Box>
    </Box>
  );
};

export default ManageProducts;
