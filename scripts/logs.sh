#!/bin/bash
logs() {
	opc=4
	while [ "$opc" -ne 0 ]; do
		echo "1- Ver logs de acceso a SSH"
		echo "2- Ver logs de inicios de sesión"
		echo "3- Ver logs de uso del comando SUDO"
		echo "0- Salir"
		read -p "Ingrese una opción: " opc
		case $opc in
		1)
			echo "Accesos a SSH:"
			sudo zgrep -i "sshd" /var/log/secure*
			#-i hace que ignore si aparece en mayúsculas
			#zgrep permite leer archivos de texto plano y archivos comprimidos (.gz)
			;;
		2)
			echo "Inicios de sesión:"
			sudo zgrep -Ei "login|ACCEPTED|session opened" /var/log/secure*
			#-E hace que pueda poner dos palabras y el | hace que busque cualquiera de las dos
			;;
		3)
			echo "Uso del comando sudo:"
			sudo zgrep -i "sudo" /var/log/secure*
			;;
		0) echo "Saliendo..." ;;
		*) echo "Opción inválida" ;;
		esac
	done
}
