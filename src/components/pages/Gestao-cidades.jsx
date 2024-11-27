import { useState, useEffect, useRef } from 'react';
import { Button, Dialog, InputText, DataTable, Column, Card } from 'primereact';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { Toast } from 'primereact/toast';

const ManageCities = () => {
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    provincia: '',  
    dataCriacao: '',
    dataActualizacao: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [cityToDelete, setCityToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toastRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/cidade/listar')
      .then(response => {
        setCities(response.data);
      })
      .catch(error => {
        toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar cidades: ' + error.message });
      });

    axios.get('http://localhost:8080/api/provincia/listar')
      .then(response => {
        setProvinces(response.data);
      })
      .catch(error => {
        toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar províncias: ' + error.message });
      });
  }, []);

  const handleAddCity = () => {
    const updatedFormData = {
      ...formData,
      provincia: { id: formData.provincia },
      dataCriacao: formData.dataCriacao,
      dataActualizacao: formData.dataActualizacao,
    };

    if (isEditing) {
      axios.put('http://localhost:8080/api/cidade/actualizar', updatedFormData)
        .then(response => {
          setCities(cities.map(city => city.id === formData.id ? response.data : city));
          setShowDialog(false);
          resetForm();
          toastRef.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Cidade atualizada com sucesso!' });
        })
        .catch(error => {
          toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar cidade: ' + error.message });
        });
    } else {
      axios.post('http://localhost:8080/api/cidade/adicionar', updatedFormData)
        .then(response => {
          setCities([...cities, response.data]);
          setShowDialog(false);
          resetForm();
          toastRef.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Cidade adicionada com sucesso!' });
        })
        .catch(error => {
          toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar cidade: ' + error.message });
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

  const handleEditCity = (cityId) => {
    const city = cities.find(c => c.id === cityId);
    setFormData({
      ...city,
      provincia: city.provincia?.id || '',
    });
    setIsEditing(true);
    setShowDialog(true);
  };

  const handleDeleteCity = () => {
    axios.delete(`http://localhost:8080/api/cidade/${cityToDelete}`)
      .then(() => {
        setCities(cities.filter(city => city.id !== cityToDelete));
        setShowDeleteDialog(false);
        toastRef.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Cidade excluída com sucesso!' });
      })
      .catch(error => {
        toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar cidade: ' + error.message });
        setShowDeleteDialog(false);
      });
  };

  const confirmDelete = (cityId) => {
    setCityToDelete(cityId);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      nome: '',
      provincia: '',
      dataCriacao: '',
      dataActualizacao: '',
    });
    setIsEditing(false);
  };

  const filteredCities = cities.filter(city =>
    city.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'stretch', minHeight: '100vh', backgroundColor: '#f0f0f0', padding: '20px' }}>
      <Box sx={{ margin: '2 auto', width: '100%', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Card title="Cidades" style={{ flex: 1, padding: '2rem', background: '#fff', borderRadius: '16px', boxShadow: '0 0.2px 0.2px rgba(0, 0, 0, 0.1)', height: '100%' }}>
          <Typography variant="h4" component="h2" gutterBottom style={{ marginBottom: '20px', textAlign: 'center' }}>
          </Typography>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome"
              style={{ width: '300px', borderRadius: '8px', padding: '10px', background: '#f7f7f7', border: '1px solid #e0e0e0' }}
            />
          </div>

          <Button
            label="Adicionar Cidade"
            icon="pi pi-plus"
            onClick={() => { resetForm(); setShowDialog(true); }}
            style={{ backgroundColor: '#ff4d94', borderColor: '#ff4d94', marginBottom: '20px', padding: '10px 20px' }}
          />

          <DataTable value={filteredCities} paginator rows={10} responsiveLayout="scroll" style={{ width: '100%' }}>
            <Column field="nome" header="Nome" />
            <Column field="provincia.nome" header="Província" />
            <Column field="dataCriacao" header="Data de Criação" body={(rowData) => new Date(rowData.dataCriacao).toLocaleString()} />
            <Column
              header="Ações"
              body={(rowData) => (
                <div>
                  <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => handleEditCity(rowData.id)} style={{ marginRight: '10px' }} />
                  <Button icon="pi pi-trash" className="p-button-rounded p-button-text" onClick={() => confirmDelete(rowData.id)} />
                </div>
              )}
            />
          </DataTable>
        </Card>

        <Dialog header={isEditing ? "Editar Cidade" : "Adicionar Cidade"} visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
          <div>
            <div className="p-field">
              <label htmlFor="nome">Nome da Cidade</label>
              <InputText id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required style={{ width: '100%', borderRadius: '8px', padding: '12px', background: '#f7f7f7', border: '1px solid #e0e0e0' }} />
            </div>
            <div className="p-field">
              <label htmlFor="provincia">Província</label>
              <select name="provincia" value={formData.provincia} onChange={handleInputChange} style={{ width: '100%', borderRadius: '8px', padding: '12px', background: '#f7f7f7', border: '1px solid #e0e0e0' }}>
                <option value="">Selecione uma província</option>
                {provinces.map(provincia => <option key={provincia.id} value={provincia.id}>{provincia.nome}</option>)}
              </select>
            </div>
            <Button label={isEditing ? "Atualizar" : "Adicionar"} icon="pi pi-check" onClick={handleAddCity} style={{ backgroundColor: '#ff4d94', borderColor: '#ff4d94', width: '100%', padding: '10px 20px' }} />
          </div>
        </Dialog>

        <Dialog visible={showDeleteDialog} header="Confirmar Exclusão" modal footer={
          <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowDeleteDialog(false)} />
            <Button label="Excluir" icon="pi pi-check" onClick={handleDeleteCity} style={{ backgroundColor: '#ff4d94', borderColor: '#ff4d94' }} />
          </div>
        } onHide={() => setShowDeleteDialog(false)}>
          <p>Tem certeza de que deseja excluir esta cidade?</p>
        </Dialog>

        <Toast ref={toastRef} />
      </Box>
    </Box>
  );
};

export default ManageCities;
