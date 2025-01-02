	/*----------------------------------+
	| CONSTANTES E OBJECTOS NECESS�RIOS |
	+----------------------------------*/
	
	//constantes
	var MAINDIV='divCalendario';
	var CORFERI='lightGreen';
	var CORPROD='lightBlue';
	var CORFIMS='#DDDDDD';
	var CORDPAS='#F5F5F5';
	var CORHOJE='yellow';
	var NOMEMES= new Array('?','Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez');
	var NOMESEM= new Array('Do','Se','Te','Qu','Qu','Se','Sa','Do');
	
	//esta vari�vel permite fazer "highlight" de um elemento ou grupo (array)
	var highLightUI = [];
	
	/*-----------------------+
	| Objecto feriado        |
	+-----------------------*/
	function Feriado(data,desc) {
		this.dt=data;
		this.nm=desc;
	}
	//Carrega Array de feriados
	var FERIADOfloats=4;
	var FERIADOfloats=3;
	var FERIADOano=0;
	var FERIADO=[];
	//- floatings
	FERIADO.push(new Feriado('0001-01-01','Carnaval'));
	FERIADO.push(new Feriado('0001-01-01','Sexta-Feira Santa'));
	FERIADO.push(new Feriado('0001-01-01','Domingo de P�scoa'));
	FERIADO.push(new Feriado('0001-01-01','Corpo de Deus'));
	//- fixed date
	FERIADO.push(new Feriado('0001-01-01','Ano Novo'));
	FERIADO.push(new Feriado('0001-04-25','Dia da Liberdade'));
	FERIADO.push(new Feriado('0001-05-01','Dia do Trabalhador'));
	FERIADO.push(new Feriado('0001-06-10','Dia de Portugal'));
	FERIADO.push(new Feriado('0001-06-13','Municipal de Lisboa'));
	FERIADO.push(new Feriado('0001-08-15','Assun��o de Nossa Senhora'));
	FERIADO.push(new Feriado('0001-10-05','Implanta��o da Rep�blica'));
	FERIADO.push(new Feriado('0001-11-01','Todos os Santos'));
	FERIADO.push(new Feriado('0001-12-01','Restaura��o da Independ�ncia'));
	FERIADO.push(new Feriado('0001-12-08','Imaculada Concei��o'));
	FERIADO.push(new Feriado('0001-12-24','Feriado Banc�rio'));
	FERIADO.push(new Feriado('0001-12-25','Natal'));

	//Calcular feriados de um Ano, acerta Array(FERIADO)
	function calculaFeriados(ano) {
		//obter f1
		var i1=(ano%19);
		var i2=parseInt(parseInt(ano/100)/4);
		var i3=parseInt((parseInt(ano/100)+8)/25);
		var i4=parseInt((parseInt(ano/100)-i3+1)/3);
		var f1=parseInt(((i1*19)+parseInt(ano/100)-i2-i4+15)%30);
		//obter f2
		i1=parseInt((ano%100)/4);
		i2=(parseInt(ano/100)%4);
		i3=((ano%100)%4);
		var f2=parseInt((32+(2*i2)+(2*i1)-f1-i3)%7);
		//obter f3
		var f3=parseInt(((ano%19)+(11*f1)+(22*f2))/451); //move int , = int...
		//obter domingo de p�scoa
		var mesPascoa=parseInt((f1+f2-(7*f3)+114)/31);
		var diaPascoa=((f1+f2-(7*f3)+114)%31)+1;
		var domPascoa=formatData(ano+'-'+mesPascoa+'-'+diaPascoa);
		//Atribuir agora os feriados
		FERIADO[0].dt=addDiasData(domPascoa,-47,'N'); //Carnaval = resultado -47 dias
		FERIADO[1].dt=addDiasData(domPascoa,-2,'N'); //6�Feira = resultado -2 dias
		FERIADO[2].dt=domPascoa; //P�scoa = resultado
		FERIADO[3].dt=addDiasData(domPascoa,60,'N'); //Corpo de deus = resultado + 60 dias
		//Acerta o ano dos restantes feriados
		for(var i=FERIADOfloats;i<FERIADO.length;i++) FERIADO[i].dt=ano+FERIADO[i].dt.substring(4);
		//assinala o ano carregado
		FERIADOano=ano;
	}

	//verificar se dia � feriado, e devolve descri��o!
	function verificaFeriado(data) {
		var ret=null;
		for(var i=0;i<FERIADO.length;i++) {
			if(data==FERIADO[i].dt) {
				ret=FERIADO[i].nm;
				break;
			}
		}
		return ret;
	}

	//devolve dias do m�s
	function diasMes(ano,mes) {
		if(mes==2) return diasFevereiro(ano);
		else if(mes==4 || mes==6 || mes==9 || mes==11) return 30;
		else return 31;
	}
	
	//devolve dia da semana (0=domingo, 1=segunda,...2=ter�a,...)
	function diaSemana(dt) {
		var a=dt.split('-');
		var d=new Date(parseInt(a[0]),parseInt(a[1].replace(/0*/,' ')-1),parseInt(a[2].replace(/0*/,' ')));
		return d.getDay();
	}

	//Verifica se um ano � bissexto e devolve dias de Fevereiro.
	function diasFevereiro(ano) {
		var ab=0;
		if(ano%4==0) ab=1;
		if((ano%1000)==0 && (ano%400)!=0) ab=0;
		return ab+28;
	}

	//Converte uma string em formato "AAAA-MM-DD"
	function formatData(v) {
		var d=v.split('-');
		while(d[0].length<4) d[0]='0'+d[0];
		while(d[1].length<2) d[1]='0'+d[1];
		while(d[2].length<2) d[2]='0'+d[2];
		return (d[0]+'-'+d[1]+'-'+d[2]);
	}

	//Adicionar dias a uma data e devolver nova data
	//Se u=='S' soma �teis...
	function addDiasData(dt,d,u) {
		var dr=dt;
		var s='';
		var n=d;
		if(d<0) {
			n*=-1;
			s='-';
		}
		for(var i=0;i<n;i++) dr=somaDiaData(dr,s,u);
		return dr;
	}
	
	//Adicionar um dia (pode ser negativo ) a uma data
	//Se s=='-' subtrai...
	//Se u=='S' soma �teis...
	function somaDiaData(dt,s,u) {
		var d1=false;
		var a=dt.split('-');
		var va=parseInt(a[0]);
		if(FERIADOano!=va && u=='S') calculaFeriados(va);
		var vm=parseInt(a[1].replace(/0*/,' '));
		var dm=diasMes(va,vm);
		var vd=parseInt(a[2].replace(/0*/,' '));
		if(s=='-') {
			vd-=1;
			if(vd<1) {
				vm-=1;
				if(vm<1) {
					vm=12;
					va-=1;
				}
				vd=diasMes(va,vm);
			}
		} else {
			vd+=1;
			if(vd>dm) {
				vd=1;
				vm+=1;
				if(vm>12) {
					vm=1;
					va+=1;
					d1=true;
				}
			}
		}
		var dr=formatData(va+'-'+vm+'-'+vd);
		var ds=diaSemana(dr);
		if(u=='S' && (ds==0 || ds==6 || d1==true || verificaFeriado(dr)!=null)) dr=somaDiaData(dr,s,u);
		return dr;
	}
	
	//Devolver a diferen�a de dias entre duas datas
	//**** NOTA: ESTA FUN��O EST� ERRADA E S� FUNCIONA NO MESMO ANO
	//**** TEM APENAS COMO OBJECTIVO DAR UMA DATA PREVISTA...
	function DifDias(d1,d2) {
		var a1 = d1.split('-');
		var a2 = d2.split('-');
		return ((a1[0] - a2[0]) * 365 + (a1[1] - a2[1]) * 30 + (a1[2] - a2[2]));
	}

	/*---------------------------------+
	| Objecto per�odo de f�rias        |
	+---------------------------------*/
	function FerPer(ano,inicio,dias,obs,tip) {
		this.ano=parseInt(ano);
		this.ini=formatData(inicio);
		this.fim=addDiasData(this.ini,(dias-1),'S'); //�teis
		this.dur=dias;
		if(obs!=null) this.obs=obs;
		else this.obs='';
		this.tip=(tip&&tip!=null?tip:'h');
	}

	/*---------------------------------+
	| Objecto user c/array de f�rias   |
	+---------------------------------*/
	function FerUser(uid,nome) {
		this.ui=uid;
		this.nm=nome;
		this.ap=new Array();
	}

	//objectos
	var feriasRegisto=new Array();
	
	//Devolver indice de um utilizador
	function findUser(uid) {
		for(var i=0;i<feriasRegisto.length;i++) {
			if(feriasRegisto[i].ui==uid) {
				return i;
			}
		}
		return -1;
	}
	
	//desenhar calend�rio e F�rias
	//Assume que existe um objecto "DIV" com as f�rias
	function drawCal(ano) {
	
		//calcula feriados
		calculaFeriados(ano);
	
		//eliminar objecto DIV
		var div=document.getElementById(MAINDIV);
		if(div!=null) document.body.removeChild(div);
		
		//criar div principal
		div=document.createElement('DIV');
		div.setAttribute('id',MAINDIV);

		//carregar cabe�alho
		var tb=document.createElement('TABLE');
		var db=document.createElement('TBODY');
		var tr=document.createElement('TR');
		var th=document.createElement('TH');
		th.appendChild(document.createTextNode('M�s'));
		tr.appendChild(th);
		for(var i=1;i<38;i++) {
			th=document.createElement('TH');
			if((i%7)==0 || (i%7)==6) th.style.backgroundColor=CORFIMS;
			th.appendChild(document.createTextNode(NOMESEM[(i%7)]));
			tr.appendChild(th);
		}
		db.appendChild(tr);
		
		//carregar detalhe
		var dc = new Date();
		var dh = formatData(dc.getYear()+'-'+(dc.getMonth()+1)+'-'+dc.getDate());
		for(var i=1;i<13;i++) db.appendChild(drawCalMonth(ano,i,dh));
		tb.appendChild(db);
		div.appendChild(tb);
		
		//Informa��o adicional
		tb=document.createElement('TABLE');
		db=document.createElement('TBODY');
		tr=document.createElement('TR');
		th=document.createElement('TH');
		th.appendChild(document.createTextNode('Feriados de '+ano));
		tr.appendChild(th);
		th=document.createElement('TH');
		th.appendChild(document.createTextNode('F�rias referentes a '+ano));
		tr.appendChild(th);
		db.appendChild(tr);
		tr=document.createElement('TR');
		
		//feriados
		th=document.createElement('TD');
		th.style.verticalAlign='top';
		var tb2=document.createElement('TABLE');
		var db2=document.createElement('TBODY');
		for(var i=0;i<FERIADO.length;i++) {
			var tr2=document.createElement('TR');
			var tdf=document.createElement('TD');
			tdf.appendChild(document.createTextNode(FERIADO[i].nm));
			var tdd=document.createElement('TD');
			tdd.appendChild(document.createTextNode(FERIADO[i].dt));
			tr2.appendChild(tdf);
			tr2.appendChild(tdd);
			db2.appendChild(tr2);
		}
		tb2.appendChild(db2);
		th.appendChild(tb2);
		tr.appendChild(th);
		
		//ferias
		th=document.createElement('TD');
		th.style.verticalAlign='top';
		tb2=document.createElement('TABLE');
		db2=document.createElement('TBODY');
		var adi=formatData(ano+'-01-01');
		var adf=formatData(ano+'-12-31');
		for(var i=0;i<feriasRegisto.length;i++) {
			var totDias=0;
			var tr2=document.createElement('TR');
			var tdf=document.createElement('TD');
			tdf.appendChild(document.createTextNode(feriasRegisto[i].nm));
			var tdd=document.createElement('TD');
			tdd.style['textAlign']='left';
			for(var j=0;j<feriasRegisto[i].ap.length;j++) {
				if(feriasRegisto[i].ap[j].ano==ano) {
					totDias+=feriasRegisto[i].ap[j].dur;
					//if(feriasRegisto[i].ap[j].ini<adf && feriasRegisto[i].ap[j].fim>adi) {
					tdd.appendChild(document.createTextNode(getPerTypeInfo(feriasRegisto[i].ap[j].tip,feriasRegisto[i].ap[j].obs)[0]+': '+feriasRegisto[i].ap[j].ini+ ' a '+feriasRegisto[i].ap[j].fim+' ('+feriasRegisto[i].ap[j].dur+' dias '+feriasRegisto[i].ap[j].obs+')'));
					tdd.appendChild(document.createElement('BR'));
				}
			}
			//tdd.appendChild(document.createElement('BR'));
			tdd.appendChild(document.createTextNode(totDias+' dias.'));

			tr2.appendChild(tdf);
			tr2.appendChild(tdd);
			db2.appendChild(tr2);
		}
		tb2.appendChild(db2);
		th.appendChild(tb2);
		tr.appendChild(th);
		db.appendChild(tr);
		tb.appendChild(db);
		div.appendChild(tb);
	
		//ok, mostra
		document.body.appendChild(div);
	}
	
	
	//desenha a TR de um determinado m�s
	function drawCalMonth(ano,mes,dh) {
		var tr=document.createElement('TR');
		var m=document.createElement('TD');
		m.appendChild(document.createTextNode(NOMEMES[mes])); // +'/'+ano
		tr.appendChild(m);
		var di=diaSemana(formatData(ano+'-'+mes+'-01'));
		if(di==0) di=7;
		var df=diasMes(ano,mes);
		var d=0;
		for(var i=1;i<38;i++) {
			var td=document.createElement('TD');
			var tdText='';
			td.style.verticalAlign='top';
			if(i>=di && d<df) {
				d+=1;
				td.appendChild(document.createTextNode(d));
				var cd=formatData(ano+'-'+mes+'-'+d);
				var ds=diaSemana(cd);
				if(verificaFeriado(cd)!=null) {
					td.style.backgroundColor=CORFERI;
					td.style.cursor='help';
					tdText+=verificaFeriado(cd)+'\n';
				} else if(ds==0 ||ds==6) {
					td.style.backgroundColor=CORFIMS;
				} else if(cd < dh) {
					td.style.backgroundColor=CORDPAS;
				} else if(cd == dh) td.style.backgroundColor=CORHOJE;
				
				for(var j=0;j<feriasRegisto.length;j++) {
					for(var k=0;k<feriasRegisto[j].ap.length;k++) {
						var per = feriasRegisto[j].ap[k];
						if(cd>=per.ini && cd<=per.fim) {
							td.appendChild(document.createElement('BR'));
							var ui=document.createElement('SPAN');
							ui.appendChild(document.createTextNode(feriasRegisto[j].ui)); 
							//highlights
							for( var y = 0; y < highLightUI.length; y++ ) {
								if( feriasRegisto[j].ui == highLightUI[y] ) {
									ui.style['backgroundColor'] = 'cyan';
									break;
								}
							}
							ui.style.color=getPerTypeInfo(per.tip,per.obs)[1];
							td.appendChild(ui);
							tdText+=getPerTypeInfo(per.tip,per.obs)[0]+' '+feriasRegisto[j].nm+(per.obs==''?'':' : '+per.obs)+'\n';
						}
					}
				}
				if(tdText!='') td.setAttribute('title',(tdText+'\n'+DifDias(cd,dh)+ (cd > dh ? ' days to Come...' : ' days Ago...')));
			} else {
				td.classList.add("void");
			}
			tr.appendChild(td);
		}
		return tr;
	}
	
	//adicionar utilizador
	function addUser(uid,nome) {
		var i=findUser(uid);
		if(i<0) feriasRegisto.push(new FerUser(uid,nome));
		else feriasRegisto[i].nm=nome;
	}
	
	//adicionar per�odo de f�rias
	function addPeriodo(ano,uid,inicio,dias,obs,tip) {
		var i=findUser(uid);
		if(i<0){feriasRegisto.push(new FerUser(uid,'...'));i=feriasRegisto.length-1;}
		feriasRegisto[i].ap.push(new FerPer(ano,inicio,dias,obs,tip));
	}
	
	//caracteristicas de tipos de aus�ncia (fun��o com override na p�gina principal)
	//devolve array, elemento 1 = texto, elemento = c�r
	function getPerTypeInfo(t,obs){return ['F�rias','black']}
	
