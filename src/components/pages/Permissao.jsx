import { useState, useEffect, useRef } from 'react';
import { Button, Dialog, InputText, DataTable, Column, Card } from 'primereact';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { Toast } from 'primereact/toast';

const ManagePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    dataCriacao: '',
    dataActualizacao: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toastRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/permissao/buscar')
      .then(response => {
        setPermissions(response.data);
      })
      .catch(error => {
        toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar permissões: ' + error.message });
      });
  }, []);

  const handleAddPermission = () => {
    if (isEditing) {
      axios.put('http://localhost:8080/api/permissao/actualizar', formData)
        .then(response => {
          setPermissions(permissions.map(permission => permission.id === formData.id ? response.data : permission));
          setShowDialog(false);
          resetForm();
          toastRef.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Permissão atualizada com sucesso!' });
        })
        .catch(error => {
          toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar permissão: ' + error.message });
        });
    } else {
      axios.post('http://localhost:8080/api/permissao/adicionar', formData)
        .then(response => {
          setPermissions([...permissions, response.data]);
          setShowDialog(false);
          resetForm();
          toastRef.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Permissão adicionada com sucesso!' });
        })
        .catch(error => {
          toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar permissão: ' + error.message });
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

  const handleEditPermission = (permissionId) => {
    const permission = permissions.find(p => p.id === permissionId);
    setFormData(permission);
    setIsEditing(true);
    setShowDialog(true);
  };

  const handleDeletePermission = () => {
    axios.delete(`http://localhost:8080/api/permissao/${permissionToDelete}`)
      .then(() => {
        setPermissions(permissions.filter(permission => permission.id !== permissionToDelete));
        setShowDeleteDialog(false);
        toastRef.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Permissão excluída com sucesso!' });
      })
      .catch(error => {
        toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar permissão: ' + error.message });
        setShowDeleteDialog(false);
      });
  };

  const confirmDelete = (permissionId) => {
    setPermissionToDelete(permissionId);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      nome: '',
      dataCriacao: '',
      dataActualizacao: '',
    });
    setIsEditing(false);
  };

  const filteredPermissions = permissions.filter(permission =>
    permission.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'stretch', minHeight: '100vh', backgroundColor: '#f0f0f0', padding: '20px' }}>
      <Box sx={{ margin: '2 auto', width: '100%', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Card title="Permissões" style={{ flex: 1, padding: '2rem', background: '#fff', borderRadius: '16px', boxShadow: '0 0.2px 0.2px rgba(0, 0, 0, 0.1)', height: '100%' }}>
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
            label="Adicionar Permissão"
            icon="pi pi-plus"
            onClick={() => { resetForm(); setShowDialog(true); }}
            style={{ backgroundColor: '#ff4d94', borderColor: '#ff4d94', marginBottom: '20px', padding: '10px 20px' }}
          />

          <DataTable value={filteredPermissions} paginator rows={10} responsiveLayout="scroll" style={{ width: '100%' }}>
            <Column field="nome" header="Nome" />
            <Column field="dataCriacao" header="Data de Criação" body={(rowData) => new Date(rowData.dataCriacao).toLocaleString()} />
            <Column
              header="Ações"
              body={(rowData) => (
                <div>
                  <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => handleEditPermission(rowData.id)} style={{ marginRight: '10px' }} />
                  <Button icon="pi pi-trash" className="p-button-rounded p-button-text" onClick={() => confirmDelete(rowData.id)} />
                </div>
              )}
            />
          </DataTable>
        </Card>

        <Dialog header={isEditing ? "Editar Permissão" : "Adicionar Permissão"} visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
          <div>
            <div className="p-field">
              <label htmlFor="nome">Nome da Permissão</label>
              <InputText id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required style={{ width: '100%', borderRadius: '8px', padding: '12px', background: '#f7f7f7', border: '1px solid #e0e0e0' }} />
            </div>
            <Button label={isEditing ? "Atualizar" : "Adicionar"} icon="pi pi-check" onClick={handleAddPermission} style={{ backgroundColor: '#ff4d94', borderColor: '#ff4d94', width: '100%', padding: '10px 20px' }} />
          </div>
        </Dialog>

        <Dialog visible={showDeleteDialog} header="Confirmar Exclusão" modal footer={
          <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowDeleteDialog(false)} />
            <Button label="Excluir" icon="pi pi-check" onClick={handleDeletePermission} style={{ backgroundColor: '#ff4d94', borderColor: '#ff4d94' }} />
          </div>
        } onHide={() => setShowDeleteDialog(false)}>
          <p>Tem certeza de que deseja excluir esta permissão?</p>
        </Dialog>

        <Toast ref={toastRef} />
      </Box>
    </Box>
  );
};

export default ManagePermissions;
