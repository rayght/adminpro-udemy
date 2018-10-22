import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
/*import swal from 'sweetalert';*/

declare let swal: any;

@Component({
  selector   : 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles     : []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[];
  desde: number;
  totalRegistros: number;
  cargando: boolean;

  constructor( public usuarioService: UsuarioService, public modalUploadService: ModalUploadService ) {
    this.cargando = false;
    this.desde = 0;
    this.totalRegistros = 0;
  }

  ngOnInit() {
    this.cargarUsuarios();
    this.modalUploadService.notificacion.subscribe(resp => {
      this.cargarUsuarios();
    });
  }

  mostrarModal( id: string ) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe(( resp: any ) => {
        this.totalRegistros = resp.total;
        this.usuarios = resp.usuarios;
        this.cargando = false;
      });
  }

  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this.usuarioService.buscarUsuarios(termino)
      .subscribe(( usuarios: Usuario[] ) => {
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  borrarUsuario( usuario: Usuario ) {
    if ( usuario._id === this.usuarioService.usuario._id ) {
      swal('Error', 'No se puede borrar a si mismo', 'error');
      return;
    }

    swal({
      title     : '¿Está seguro?',
      text      : 'Está a punto de borrar a ' + usuario.nombre,
      icon      : 'warning',
      buttons   : true,
      dangerMode: true,
    }).then(( borrar ) => {
      if ( borrar ) {
        this.usuarioService.borrarUsuario(usuario._id).subscribe(() => {
          swal('Usuario borrado', 'Se ha borrado el usuario', 'success');
          this.cargarUsuarios();
        });
      }
    });
  }

  guardarUsuario( usuario: Usuario ) {
    this.usuarioService.actualizarUsuario(usuario).subscribe();
  }

}
