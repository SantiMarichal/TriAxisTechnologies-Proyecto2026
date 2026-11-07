#!/bin/bash
crearGrupo() {
	read -p "Ingrese el nombre del grupo ha ser creado: " nombreGrupoCrear
	if getent group "$nombreGrupoCrear" &>/dev/null; then
		echo "El grupo ya existe."
	else
		sudo groupadd "$nombreGrupoCrear"
		echo "Grupo creado correctamente."
	fi
}
borrarGrupo() {
	read -p "Ingrese el nombre del grupo ha ser borrado: " nombreGrupoBorrar
	if getent group "$nombreGrupoBorrar" &>/dev/null; then
		sudo groupdel "$nombreGrupoBorrar"
		echo "Grupo borrado correctamente."
	else
		echo "Ese grupo no existe."
	fi
}
modificarGrupo() {
	read -p "Ingrese el nombre del grupo actual: " nombreGrupoAnterior
	read -p "Ingrese el nombre del grupo nuevo: " nombreGrupoNuevo
	if getent group "$nombreGrupoNuevo" &>/dev/null; then
		echo "El nuevo nombre ya existe."
	else
		if getent group "$nombreGrupoAnterior" &>/dev/null; then
			sudo groupmod -n "$nombreGrupoNuevo" "$nombreGrupoAnterior"
			echo "Grupo modificado correctamente."
		else
			echo "El grupo anterior no existe."
		fi
	fi
}
