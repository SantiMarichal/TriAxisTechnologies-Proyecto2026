#!/bin/bash

respaldoLocal() {
	echo "Ha ingresado la opcion 1: "
	opc=4
	while [[ "$opc" -ne 0 ]]; do
		read -p "Ingrese que quiere hacer: 1- Respaldar ahora / 2- Planificarlo / 0- Salir: " opc
		case $opc in
		1)
			echo "Ha ingresado la opcion 1: "
			read -p "Cual va a ser el nombre del respaldo: " nombre1
			read -p "Cual es la ruta del archivo: " ruta1
			if [ -e "$ruta1" ]; then
				fecha=$(date +"%Y-%m-%d_%H-%M-%S")
				if tar -cvzf "${nombre1}_${fecha}.tar.gz" "$ruta1"; then
					echo "Respaldo listo"
				else
					echo "Error al crear el respaldo."
				fi
			else
				echo "Ese archivo no existe"
			fi
			;;
		2)
			echo "Ha ingresado la opción 2 (Planificado):"
			read -p "Nombre del respaldo: " nombre2
			read -p "Ruta del archivo/directorio: " ruta2
			if [ -e "$ruta2" ]; then
				read -p "Ingrese en que minuto (* o 0-59) quiere que se haga el respaldo: " minuto
				read -p "Ingrese en que hora (* o 0-23) quiere que se haga el respaldo: " hora
				read -p "Ingrese que dia del mes (* o 1-31) quiere que se haga el respaldo: " dia
				read -p "Ingrese que mes (* o 1-12) quiere que se haga el respaldo: " mes
				read -p "Ingrese que dia de la semana (* o 0-6) quiere que se haga el respaldo: " semana
				comando_cron="tar -czf \$HOME/${nombre2}_\$(date +\\%Y-\\%m-\%d_\\%H-\\%M-\%S).tar.gz \"$ruta2\""
				if (
					crontab -l 2>/dev/null
					echo "$minuto $hora $dia $mes $semana $comando_cron"
				) | crontab -; then
					echo "Tarea programada correctamente en crontab."
				else
					echo "Error al guardar en crontab."
				fi
			else
				echo "La ruta especificada no existe."
			fi
			;;
		0)
			echo "Saliendo..."
			;;
		*)
			echo "Opción no válida."
			;;
		esac
	done
}

respaldoRemoto() {
	opc2=3
	while [ "$opc2" -ne 0 ]; do
		echo "Ha ingresado a la opcion 2: "
		read -p "Ingrese que quiere hacer: 1- Respaldar ahora / 2- Planificarlo / 0- Salir: " opc2
		case $opc2 in
		1)
			echo "Ha ingresado la opcion 1: "

			read -p "Ingrese el nombre del respaldo: " nombre2
			read -p "Ingrese la ruta del archivo: " ruta2
			if [ -e "$ruta2" ]; then
				fecha=$(date +"%Y-%m-%d_%H-%M-%S")
				archivo_tar="${nombre2}_${fecha}.tar.gz"
				if tar -cvzf "$archivo_tar" "$ruta2"; then
					echo "Respaldo listo"
					read -p "Ingrese el nombre del usuario remoto: " nombre3
					read -p "Ingrese la ip del usuario remoto: " ip
					read -p "Ingrese la ruta donde se guarda remotamente: " ruta4
					if scp "$archivo_tar" "$nombre3@$ip:$ruta4"; then
						echo "Archivo enviado correctamente"
					else
						echo "Error al enviar el archivo"
					fi
				else
					echo "El archivo a enviar no existe."
				fi

			else
				echo "Ese archivo o directorio no existe"
			fi
			;;
		2)
			echo "Ha ingresado la opcion 2: "
			read -p "Ingrese el nombre del respaldo: " nombre4
			read -p "Ingrese la ruta del archivo: " ruta5
			if [ -e "$ruta5" ]; then
				echo "El archivo existe."
				read -p "Ingrese el nombre del usuario remoto: " nombre5
				read -p "Ingrese la ip del usuario remoto: " ip2
				read -p "Ingrese la ruta donde se guarda remotamente: " ruta6
				read -p "Ingrese en que minuto (* o 0-59) quiere que se haga el respaldo: " minuto
				read -p "Ingrese en que hora (* o 0-23) quiere que se haga el respaldo: " hora
				read -p "Ingrese que dia del mes (* o 1-31) quiere que se haga el respaldo: " dia
				read -p "Ingrese que mes (* o 1-12) quiere que se haga el respaldo: " mes
				read -p "Ingrese que dia de la semana (* o 0-6) quiere que se haga el respaldo: " semana
				comando_cron="archivo=\$HOME/${nombre4}_\$(date +\\%Y-\\%m-\%d_\\%H-\\%M-\%S).tar.gz; tar -czf \"\$archivo\" \"$ruta5\" && /usr/bin/scp \"\$archivo\" \"$nombre5@$ip2:$ruta6\" && rm \"\$archivo\""
				if (
					crontab -l 2>/dev/null
					echo "$minuto $hora $dia $mes $semana $comando_cron"
				) | crontab -; then
					echo "Respaldo remoto programado de forma correcta."
					echo "Asegúrese de tener configuradas las llaves SSH para la ejecución."
				else
					echo "Error al guardar en crontab."
				fi
				#Se utiliza contrabarra (\) para aclarar que queremos que las variables se interpreten cuando cron se ejecute, de lo contrario se interpretarian en el momento, afectando al date de forma directa.
				#crontab -l se utiliza para no borrar las tareas existentes, lo que salga de eso se envia hacia /dev/null (el numero 2 significa stderr y se usa para ocultar errores)
			else
				echo "Ese archivo o directorio no existe"
			fi
			;;
		*)
			echo "Opción no válida."
			;;
		esac
	done
}
