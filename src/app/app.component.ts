import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CodeEditorComponent,
  CodeEditorModule,
  CodeEditorService,
  CodeModel,
  provideCodeEditor,
} from '@ngstack/code-editor';
import { editor } from 'monaco-editor';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { BtnUploadFileDirective } from './utils/btn-upload-file/btn-upload-file.directive';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { CompileService } from './services/compile.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CodeEditorComponent,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    BtnUploadFileDirective,
  ],
  templateUrl: './app.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  constructor(
    private monacoSvc: CodeEditorService,
    private compileSvc: CompileService
  ) {}
  response: WritableSignal<string> = signal('');
  options: editor.IStandaloneEditorConstructionOptions = {
    contextmenu: true,

    minimap: {
      enabled: true,
    },
  };
  code: CodeModel = {
    language: 'cafeScript',
    uri: '',
    value: 'class',
  };

  sendData() {
    if (!this.code.value) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No hay código para compilar',
      });
      return;
    }
    if (this.code.value.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El código no puede estar vacío',
      });
      return;
    }
    if (this.code.value.length > 10000) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El código es demasiado largo',
      });
      return;
    }

    this.compileSvc.compileCode(this.code.value).subscribe((res) => {
      if (res.success) {
        this.response.set(res.data);
        Swal.fire({
          icon: 'success',
          title: 'Compilación exitosa',
          text: 'El código se ha compilado correctamente',
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timerProgressBar: true,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.message,
        });
        this.response.set(res.message);
      }
    });
    console.log(this.code.value);
  }
  fileUpload(file: FileList | undefined) {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (content) {
          console.log('entro');
          this.code = {
            language: 'cafeScript',
            uri: '',
            value: content.toString(),
          };
        }
      };
      reader.readAsText(file[0]);
    }
  }
  onEditorInit() {
    let monaco = this.monacoSvc.monaco;
    // Registrar el lenguaje
    monaco.languages.register({ id: 'cafeScript' });

    // Definir tokens, keywords, etc
    monaco.languages.setMonarchTokensProvider('cafeScript', {
      tokenizer: {
        root: [
          [/\b(?:foo|bar|baz)\b/, 'keyword'],
          [/\d+/, 'number'],
          [/[{}]/, 'delimiter.bracket'],
          [/".*?"/, 'string'],
          [/\/\/.*/, 'comment'],
        ],
      },
    });

    // Opcional: definir reglas de auto-completado, folding, etc

    monaco.languages.setLanguageConfiguration('cafeScript', {
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
      ],
      comments: {
        lineComment: '//',
      },
    });
  }
}
