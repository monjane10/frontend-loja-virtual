import { useState, useEffect, useRef } from 'react';
import { Button, Dialog, InputText, DataTable, Column, Card } from 'primereact';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { Toast } from 'primereact/toast';

const ManageProvinces = () => {
  const [provinces, setProvinces] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); 
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    sigla: '',
    dataCriacao: '',
    dataActualizacao: '',
  });
  const [isEditing, setIsEditing] = useState(false); 
  const [provinceToDelete, setProvinceToDelete] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const toastRef = useRef(null); // Toast reference

  useEffect(() => {
    axios.get('http://localhost:8080/api/provincia/listar')
      .then(response => {
        setProvinces(response.data);
      })
      .catch(error => {
        toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar províncias: ' + error.message });
      });
  }, []);

  const formatDateToIso = (date) => {
    if (date) {
      const [day, month, year] = date.split('/');
      const isoDate = `${year}-${month}-${day}`;
      const formattedDate = new Date(isoDate); 
      if (formattedDate.getTime()) {  
        return formattedDate.toISOString();
      } else {
        toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Data inválida: ' + date });
        return null;
      }
    }
    return null;
  };

  const handleAddProvince = () => {
    if (isEditing) {
      const updatedFormData = {
        ...formData,
        dataCriacao: formatDateToIso(formData.dataCriacao),
        dataActualizacao: formatDateToIso(formData.dataActualizacao),
      };

      axios.put('http://localhost:8080/api/provincia/alterar', updatedFormData)
        .then(response => {
          setProvinces(provinces.map(province => province.id === formData.id ? response.data : province));
          setShowDialog(false);
          resetForm();
          toastRef.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Província atualizada com sucesso!' });
        })
        .catch(error => {
          toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar província: ' + error.message });
        });
    } else {
      axios.post('http://localhost:8080/api/provincia/Inserir', formData)
        .then(response => {
          setProvinces([...provinces, response.data]);
          setShowDialog(false);
          toastRef.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Província adicionada com sucesso!' });
          resetForm();
        })
        .catch(error => {
          toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar província: ' + error.message });
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

  const handleEditProvince = (provinceId) => {
    const province = provinces.find(p => p.id === provinceId);
    setFormData({
      ...province,
      dataCriacao: province.dataCriacao ? new Date(province.dataCriacao).toLocaleString() : '', 
      dataActualizacao: province.dataActualizacao ? new Date(province.dataActualizacao).toLocaleString() : '', 
    });
    setIsEditing(true);
    setShowDialog(true);
  };

  const handleDeleteProvince = () => {
    axios.delete(`http://localhost:8080/api/provincia/${provinceToDelete}`)
      .then(() => {
        setProvinces(provinces.filter(province => province.id !== provinceToDelete));
        setShowDeleteDialog(false);
        toastRef.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Província excluída com sucesso!' });
      })
      .catch((error) => {
        toastRef.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar província: ' + error.message });
        setShowDeleteDialog(false); 
      });
  };

  const confirmDelete = (provinceId) => {
    setProvinceToDelete(provinceId); 
    setShowDeleteDialog(true); 
  };

  const resetForm = () => {
    setFormData({
      id: '',
      nome: '',
      sigla: '',
      dataCriacao: '',
      dataActualizacao: '',
    });
    setIsEditing(false);
  };

  // Função para filtrar províncias com base no termo de pesquisa
  const filteredProvinces = provinces.filter(province => 
    province.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    province.sigla.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'stretch', 
        minHeight: '100vh', 
        backgroundColor: '#f0f0f0',
        padding: '20px',
      }}
    >
      <Box
        sx={{
          margin: '2 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden', 
        }}
      >
        <Card
          title="Províncias"
          style={{
            flex: 1, 
            padding: '2rem',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 0.2px 0.2px rgba(0, 0, 0, 0.1)',
            height: '100%',
          }}
        >
          {/* Barra de pesquisa */}
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome ou sigla"
              style={{
                width: '300px',
                borderRadius: '8px',
                padding: '10px',
                background: '#f7f7f7',
                border: '1px solid #e0e0e0',
              }}
            />
          </div>

          <Button
            label="Adicionar Província"
            icon="pi pi-plus"
            onClick={() => { resetForm(); setShowDialog(true); }}
            style={{
              backgroundColor: '#ff4d94',
              borderColor: '#ff4d94',
              marginBottom: '20px',
              padding: '10px 20px',
            }}
          />

          <DataTable value={filteredProvinces} paginator rows={10} responsiveLayout="scroll" style={{ width: '100%' }}>
            <Column field="nome" header="Nome" />
            <Column field="sigla" header="Sigla" />
            <Column field="dataCriacao" header="Data de Criação" body={(rowData) => new Date(rowData.dataCriacao).toLocaleString()} />
            <Column
              header="Ações"
              body={(rowData) => (
                <div>
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text"
                    onClick={() => handleEditProvince(rowData.id)}
                    style={{ marginRight: '10px' }}
                  />
                  <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text"
                    onClick={() => confirmDelete(rowData.id)} 
                  />
                </div>
              )}
            />
          </DataTable>
        </Card>

        {/* Formulário de Adicionar / Editar Província */}
        <Dialog
          header={isEditing ? "Editar Província" : "Adicionar Província"}
          visible={showDialog}
          style={{ width: '50vw' }}
          onHide={() => setShowDialog(false)}
        >
          <div>
            <div className="p-field">
              <label htmlFor="nome">Nome da Província</label>
              <InputText
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  padding: '12px',
                  boxSizing: 'border-box',
                  background: '#f7f7f7',
                  border: '1px solid #e0e0e0',
                }}
              />
            </div>
            <div className="p-field">
              <label htmlFor="sigla">Sigla</label>
              <InputText
                id="sigla"
                name="sigla"
                value={formData.sigla}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  padding: '12px',
                  boxSizing: 'border-box',
                  background: '#f7f7f7',
                  border: '1px solid #e0e0e0',
                }}
              />
            </div>
            <Button
              label={isEditing ? "Atualizar" : "Adicionar"}
              icon="pi pi-check"
              onClick={handleAddProvince}
              style={{
                backgroundColor: '#ff4d94',
                borderColor: '#ff4d94',
                width: '100%',
                padding: '10px 20px',
              }}
            />
          </div>
        </Dialog>

        {/* Diálogo de Exclusão */}
        <Dialog
          visible={showDeleteDialog}
          header="Confirmar Exclusão"
          modal
          footer={
            <div>
              <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowDeleteDialog(false)} />
              <Button label="Excluir" icon="pi pi-check" onClick={handleDeleteProvince} style={{ backgroundColor: '#ff4d94' }} />
            </div>
          }
          onHide={() => setShowDeleteDialog(false)}
        >
          <Typography>
            Tem certeza de que deseja excluir esta província?
          </Typography>
        </Dialog>
      </Box>

      <Toast ref={toastRef} />
    </Box>
  );
};

export default ManageProvinces;
