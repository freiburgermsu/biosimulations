import { Component, Input } from '@angular/core';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';

interface IconInfo {
  type: 'mat' | 'fas' | 'fab' | 'far' | 'fal' | 'fad' | 'cc';
  name: IconName;
  spin?: boolean;
}

export type BiosimulationsIcon =
  | 'home'
  | 'file'
  | 'help'
  | 'tutorial'
  | 'journal'
  | 'info'
  | 'contact'
  | 'legal'
  | 'policy'
  | 'comment'
  | 'bug'
  | 'error'
  | 'user'
  | 'organization'
  | 'author'
  | 'curator'
  | 'reviewer'
  | 'reuser'
  | 'write'
  | 'review'
  | 'oss'
  | 'simulator'
  | 'simulators'
  | 'repository'
  | 'login'
  | 'logout'
  | 'project'
  | 'model'
  | 'parameter'
  | 'simulation'
  | 'logicalSimulation'
  | 'experiment'
  | 'task'
  | 'chart'
  | 'axes'
  | 'visualization'
  | 'browse'
  | 'new'
  | 'overview'
  | 'report'
  | 'download'
  | 'upload'
  | 'refresh'
  | 'logs'
  | 'compare'
  | 'controls'
  | 'search'
  | 'filter'
  | 'columns'
  | 'reuse'
  | 'cell'
  | 'taxon'
  | 'framework'
  | 'math'
  | 'format'
  | 'standard'
  | 'code'
  | 'operatingSystem'
  | 'softwareInterface'
  | 'license'
  | 'free'
  | 'paid'
  | 'id'
  | 'tag'
  | 'tags'
  | 'status'
  | 'date'
  | 'time'
  | 'duration'
  | 'cc0'
  | 'ccBy'
  | 'ccNc'
  | 'ccSa'
  | 'ccS'
  | 'cc'
  | 'ccByNc'
  | 'ccBySa'
  | 'ccByNcSa'
  | 'version'
  | 'copy'
  | 'fork'
  | 'link'
  | 'internalLink'
  | 'email'
  | 'git'
  | 'github'
  | 'docker'
  | 'python'
  | 'linkedin'
  | 'facebook'
  | 'twitter'
  | 'orcid'
  | 'toTop'
  | 'more'
  | 'construction'
  | 'maintainence'
  | 'valid'
  | 'invalid'
  | 'funding'
  | 'spinner'
  | 'trash'
  | 'progress'
  | 'open'
  | 'url'
  | 'share'
  | 'publish'
  | 'closed'
  | 'longRightArrow'
  | 'pdf'
  | 'video'
  | 'googleDrive'
  | 'youtube'
  | 'visible'
  | 'location'
  | 'memory'
  | 'processor'
  | 'disk'
  | 'server'
  | 'redo'
  | 'backward'
  | 'forward'
  | 'convert'
  | 'archive'
  | 'r'
  | 'image'
  | 'idea';
@Component({
  selector: 'biosimulations-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input()
  set icon(value: BiosimulationsIcon | null) {
    if (!value) {
      value = 'invalid';
    }

    this.setIcon(value);
  }

  iconLabel!: string;

  @Input()
  size?: string;

  isSyncAnimated = false;

  iconInfo!: IconInfo;

  iconMap: { [key in BiosimulationsIcon]: IconInfo } = {
    share: { type: 'fas', name: 'share-alt' },
    publish: { type: 'fas', name: 'bullhorn' },
    home: { type: 'fas', name: 'home' },
    internalLink: { type: 'fas', name: 'link' },
    link: { type: 'fas', name: 'external-link-alt' },
    toTop: { type: 'fas', name: 'angle-double-up' },
    more: { type: 'fas', name: 'angle-double-right' },
    url: { type: 'fas', name: 'cloud' },
    email: { type: 'fas', name: 'envelope' },
    git: { type: 'fab', name: 'git-alt' },
    github: { type: 'fab', name: 'github' },
    docker: { type: 'fab', name: 'docker' },
    python: { type: 'fab', name: 'python' },
    linkedin: { type: 'fab', name: 'linkedin' },
    facebook: { type: 'fab', name: 'facebook' },
    twitter: { type: 'fab', name: 'twitter' },
    orcid: { type: 'fab', name: 'orcid' },
    file: { type: 'fas', name: 'file-alt' },
    user: { type: 'fas', name: 'user' },
    organization: { type: 'fas', name: 'users' },
    author: { type: 'fas', name: 'user-edit' },
    curator: { type: 'fas', name: 'user-tag' },
    reviewer: { type: 'fas', name: 'user-check' },
    reuser: { type: 'fas', name: 'user-cog' },
    write: { type: 'fas', name: 'pencil-alt' },
    review: { type: 'fas', name: 'tasks' },
    login: { type: 'fas', name: 'sign-in-alt' },
    logout: { type: 'fas', name: 'sign-out-alt' },
    help: { type: 'fas', name: 'question-circle' },
    tutorial: { type: 'fas', name: 'book-open' },
    journal: { type: 'fas', name: 'book' },
    info: { type: 'fas', name: 'info-circle' },
    contact: { type: 'fas', name: 'comment-dots' },
    legal: { type: 'fas', name: 'balance-scale' },
    policy: { type: 'fas', name: 'shield-alt' },
    comment: { type: 'fas', name: 'comment-dots' },
    bug: { type: 'fas', name: 'bug' },
    error: { type: 'fas', name: 'exclamation' },
    project: { type: 'fas', name: 'folder-open' },
    model: { type: 'fas', name: 'project-diagram' },
    parameter: { type: 'fas', name: 'sliders-h' },
    simulation: { type: 'mat', name: 'timeline' as IconName },
    logicalSimulation: { type: 'fas', name: 'wave-square' },
    experiment: { type: 'fas', name: 'flask' },
    task: { type: 'fas', name: 'tasks' },
    chart: { type: 'fas', name: 'chart-bar' },
    axes: { type: 'fab', name: 'uncharted' },
    visualization: { type: 'fas', name: 'paint-brush' },
    browse: { type: 'fas', name: 'list' },
    new: { type: 'fas', name: 'plus-circle' },
    overview: { type: 'fas', name: 'list' },
    report: { type: 'fas', name: 'table' },
    download: { type: 'fas', name: 'download' },
    upload: { type: 'fas', name: 'upload' },
    refresh: { type: 'fas', name: 'sync-alt' },
    logs: { type: 'fas', name: 'terminal' },
    compare: {
      type: 'mat' as IconPrefix,
      name: 'stacked_line_chart' as IconName,
    },
    controls: { type: 'fas', name: 'cog' },
    search: { type: 'fas', name: 'search' },
    filter: { type: 'fas', name: 'filter' },
    columns: { type: 'fas', name: 'columns' },
    reuse: { type: 'fas', name: 'sync-alt' },
    cell: { type: 'fas', name: 'bacterium' },
    taxon: { type: 'fas', name: 'dna' },
    oss: { type: 'fab', name: 'osi' },
    framework: { type: 'fas', name: 'calculator' },
    math: { type: 'fas', name: 'square-root-alt' },
    format: { type: 'far', name: 'file-alt' },
    standard: { type: 'fas', name: 'check-double' },
    code: { type: 'fas', name: 'code' },
    operatingSystem: { type: 'fas', name: 'cog' },
    softwareInterface: { type: 'fas', name: 'desktop' },
    license: { type: 'fas', name: 'balance-scale' },
    free: { type: 'fas', name: 'lock-open' },
    paid: { type: 'fas', name: 'lock' },
    simulator: { type: 'fas', name: 'cog' },
    simulators: { type: 'fas', name: 'cogs' },
    repository: { type: 'fas', name: 'database' },
    id: { type: 'fas', name: 'hashtag' },
    tag: { type: 'fas', name: 'tag' },
    tags: { type: 'fas', name: 'tags' },
    status: { type: 'fas', name: 'tachometer-alt' },
    date: { type: 'fas', name: 'calendar-alt' },
    time: { type: 'fas', name: 'clock' },
    duration: { type: 'fas', name: 'stopwatch' },
    cc: { type: 'fab', name: 'creative-commons' },
    cc0: { type: 'fab', name: 'creative-commons-zero' },
    ccBy: { type: 'fab', name: 'creative-commons-by' },
    ccNc: { type: 'fab', name: 'creative-commons-nc' },
    ccSa: { type: 'fab', name: 'creative-commons-sa' },
    ccS: { type: 'fab', name: 'creative-commons-share' },
    ccByNc: {
      type: 'cc' as IconPrefix,
      name: 'creative-commons-by_creative-commons-nc' as IconName,
    },
    ccByNcSa: {
      type: 'cc' as IconPrefix,
      name: 'creative-commons-by_creative-commons-nc_creative-commons-sa' as IconName,
    },
    ccBySa: {
      type: 'cc' as IconPrefix,
      name: 'creative-commons-by_creative-commons-sa' as IconName,
    },
    version: { type: 'fas', name: 'code-branch' },
    copy: { type: 'fas', name: 'copy' },
    fork: { type: 'fas', name: 'code-branch' },
    construction: { type: 'fas', name: 'tools' },
    maintainence: { type: 'fas', name: 'tools' },
    valid: { type: 'fas', name: 'check' },
    invalid: { type: 'fas', name: 'times' },
    funding: { type: 'fas', name: 'dollar-sign' },
    spinner: { type: 'fas', name: 'spinner', spin: true },
    trash: { type: 'fas', name: 'trash' },
    progress: { type: 'fas', name: 'tasks' },
    open: { type: 'fas', name: 'chevron-down' },
    closed: { type: 'fas', name: 'chevron-right' },
    longRightArrow: { type: 'fas', name: 'long-arrow-alt-right' },

    pdf: { type: 'fas', name: 'file-pdf' },
    video: { type: 'fas', name: 'video' },
    googleDrive: { type: 'fab', name: 'google-drive' },
    youtube: { type: 'fab', name: 'youtube' },
    visible: { type: 'fas', name: 'eye' },

    location: { type: 'fas', name: 'location-arrow' },
    memory: { type: 'fas', name: 'memory' },
    processor: { type: 'fas', name: 'microchip' },
    disk: { type: 'fas', name: 'save' },
    server: { type: 'fas', name: 'server' },
    redo: { type: 'fas', name: 'redo-alt' },
    backward: { type: 'fas', name: 'backward' },
    forward: { type: 'fas', name: 'forward' },
    convert: { type: 'fas', name: 'exchange-alt' },

    archive: { type: 'fas', name: 'file-archive' },
    r: { type: 'fab', name: 'r-project' },
    image: { type: 'fas', name: 'image' },
    idea: { type: 'fas', name: 'lightbulb' },
  };

  constructor() {
    this.setIcon('help');
  }

  private setIcon(value: BiosimulationsIcon): void {
    this.iconInfo = this.iconMap?.[value];
    if (!this.iconInfo) {
      console.error("icon '" + value + "' not found in library");
      this.iconInfo = this.iconMap['help'];
      value = 'help';
    }
    this.iconLabel = value + '-icon';
  }
}
